"""Descarga y optimiza los medios de las páginas de proyecto.

Uso: python3 tools/projects/media.py <modelos.json dir> <salida public/media/projects> <salida modelos>

- Imágenes → WebP (calidad 80) en anchos 2000/1200/700 (sin agrandar), con transparencia si la hay.
- Videos → MP4 H.264 sin audio, máx. 1600 px de ancho, faststart, bajo 24 MB (límite de Cloudflare: 25 MiB por archivo),
  más un póster WebP del primer cuadro.
Requiere ffmpeg y ffprobe (herramientas locales, no dependencias del sitio).
"""
import json, os, re, subprocess, sys, urllib.parse, urllib.request, hashlib
from concurrent.futures import ThreadPoolExecutor

src_dir, out_dir, model_out = sys.argv[1:4]
RAW = '/tmp/claude-0/raw'
os.makedirs(RAW, exist_ok=True)
WIDTHS = [2000, 1200, 700]
LIMIT = 24 * 1024 * 1024


def name_of(url):
    base = os.path.splitext(os.path.basename(urllib.parse.urlparse(url).path))[0]
    base = re.sub(r'[^a-z0-9]+', '-', base.lower()).strip('-')
    return base[:60] or hashlib.md5(url.encode()).hexdigest()[:10]


def download(url):
    path = os.path.join(RAW, hashlib.md5(url.encode()).hexdigest() + os.path.splitext(urllib.parse.urlparse(url).path)[1].replace(' ', ''))
    if not os.path.exists(path):
        q = urllib.parse.quote(url, safe=':/%?=&')
        with urllib.request.urlopen(q, timeout=300) as r, open(path + '.part', 'wb') as f:
            f.write(r.read())
        os.rename(path + '.part', path)
    return path


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path],
                         capture_output=True, text=True).stdout.strip().split('\n')[0]
    w, h = out.split(',')[:2]
    return int(w), int(h)


def image(url, folder):
    raw = download(url)
    w, h = probe(raw)
    base = name_of(url)
    widths = sorted({min(w, x) for x in WIDTHS}, reverse=True)
    for x in widths:
        dst = os.path.join(folder, f'{base}-{x}.webp')
        if not os.path.exists(dst):
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-vf', f'scale={x}:-2:flags=lanczos',
                            '-c:v', 'libwebp', '-quality', '80', '-compression_level', '6', dst], check=True)
    return {'base': base, 'widths': widths, 'width': w, 'height': h}


def video(url, folder):
    raw = download(url)
    w, h = probe(raw)
    base = name_of(url)
    dst = os.path.join(folder, f'{base}.mp4')
    poster = os.path.join(folder, f'{base}-poster.webp')
    if not os.path.exists(dst):
        for crf, maxw in ((26, 1600), (30, 1280), (33, 1080)):
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-vf', f"scale='min({maxw},iw)':-2", '-c:v', 'libx264',
                            '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', dst], check=True)
            if os.path.getsize(dst) < LIMIT:
                break
    if not os.path.exists(poster):
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', dst, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '75', poster], check=True)
    ow, oh = probe(dst)
    return {'base': base, 'width': ow, 'height': oh, 'size': os.path.getsize(dst)}


def walk(node, fn):
    if isinstance(node, dict):
        fn(node)
        for v in node.values():
            walk(v, fn)
    elif isinstance(node, list):
        for v in node:
            walk(v, fn)


jobs = []
models = {}
for f in sorted(os.listdir(src_dir)):
    slug = f[:-5]
    m = json.load(open(os.path.join(src_dir, f)))
    models[slug] = m
    folder = os.path.join(out_dir, slug)
    os.makedirs(folder, exist_ok=True)

    def collect(n, slug=slug, folder=folder):
        if n.get('type') == 'img' and n.get('src'):
            jobs.append((n, 'image', n['src'], folder, slug))
        if n.get('type') == 'video' and n.get('src'):
            jobs.append((n, 'video', n['src'], folder, slug))
        if n.get('type') == 'row' and n.get('bgVideo') and n['bgVideo'].get('src'):
            jobs.append((n['bgVideo'], 'video', n['bgVideo']['src'], folder, slug))
        if n.get('type') == 'row' and n.get('bgImage') and n['bgImage'].get('src'):
            jobs.append((n['bgImage'], 'image', n['bgImage']['src'], folder, slug))
    walk(m['rows'], collect)


def run(job):
    n, kind, url, folder, slug = job
    try:
        info = image(url, folder) if kind == 'image' else video(url, folder)
        info['dir'] = f'/media/projects/{slug}'
        n['local'] = info
        return f'ok {kind} {url}'
    except Exception as e:  # noqa
        return f'FAIL {kind} {url}: {e}'


# Un mismo archivo puede aparecer varias veces: se procesa una vez y se copia la info a los demás nodos.
unique = {}
for job in jobs:
    unique.setdefault((job[2], job[3]), []).append(job)
with ThreadPoolExecutor(4) as ex:
    for line in ex.map(run, [group[0] for group in unique.values()]):
        print(line, flush=True)
for group in unique.values():
    for n, *_ in group[1:]:
        if 'local' in group[0][0]:
            n['local'] = group[0][0]['local']

os.makedirs(model_out, exist_ok=True)
for slug, m in models.items():
    json.dump(m, open(os.path.join(model_out, slug + '.json'), 'w'), ensure_ascii=False, indent=1)
