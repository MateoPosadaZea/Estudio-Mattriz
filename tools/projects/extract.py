"""Convierte el HTML guardado de una página de proyecto (Salient + WPBakery) en un modelo JSON limpio.

Uso: python3 tools/projects/extract.py reference/html/project_<slug>.html > src/data/projects/<slug>.json

El modelo conserva la estructura (filas, columnas, elementos), las clases de layout de WPBakery que
afectan medidas y el texto tal cual. Descarta colores de texto inline (en el vivo dejan texto blanco
sobre blanco) y todo el marcado de animación.
"""
import json, re, sys, html
from html.parser import HTMLParser

VOID = {'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'}


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    @property
    def cls(self):
        return (self.attrs.get('class') or '').split()

    def has(self, c):
        return c in self.cls

    def find_all(self, pred):
        for ch in self.children:
            if isinstance(ch, Node):
                if pred(ch):
                    yield ch
                yield from ch.find_all(pred)

    def find(self, pred):
        return next(self.find_all(pred), None)

    def text(self):
        return ''.join(ch if isinstance(ch, str) else ch.text() for ch in self.children)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root', {}, None)
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def styles(n):
    out = {}
    for part in (n.attrs.get('style') or '').split(';'):
        if ':' in part:
            k, v = part.split(':', 1)
            out[k.strip()] = v.strip()
    return out


def prefixed(n, *prefixes):
    return [c for c in n.cls if c.startswith(prefixes)]


KEEP = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'br'}


def clean_html(n):
    """HTML de texto sin clases, estilos ni envoltorios."""
    parts = []
    for ch in n.children:
        if isinstance(ch, str):
            parts.append(html.escape(ch, quote=False))
        elif ch.tag in KEEP:
            inner = clean_html(ch)
            if ch.tag == 'br':
                parts.append('<br>')
            elif ch.tag == 'a':
                href = ch.attrs.get('href', '')
                tgt = ' target="_blank" rel="noopener"' if ch.attrs.get('target') == '_blank' else ''
                parts.append(f'<a href="{html.escape(href)}"{tgt}>{inner}</a>')
            else:
                parts.append(f'<{ch.tag}>{inner}</{ch.tag}>')
        elif ch.tag in ('script', 'style', 'svg'):
            continue
        elif ch.tag == 'span' and 'maison-neue-bold' in (ch.attrs.get('style') or ''):
            parts.append(f'<b class="f-bold">{clean_html(ch)}</b>')
        else:
            parts.append(clean_html(ch))
    s = ''.join(parts)
    return re.sub(r'\s+', ' ', s)


def local_url(u):
    return html.unescape(u.strip()) if u else None


def element(n):
    c = n.cls
    st = styles(n)
    if n.has('wpb_row'):
        return row(n)
    if n.has('img-with-aniamtion-wrap'):
        img = n.find(lambda x: x.tag == 'img')
        if not img:
            return None
        align = next((a for a in ('center', 'right', 'left') if a in c), None)
        return {'type': 'img', 'src': local_url(img.attrs.get('src')), 'width': int(img.attrs.get('width') or 0),
                'height': int(img.attrs.get('height') or 0), 'alt': img.attrs.get('alt', ''), 'align': align,
                'maxWidth': n.attrs.get('data-max-width'), 'custom': 'custom-size' in c, 'style': st}
    if any(k.startswith('nectar_video_player') for k in c):
        src = n.find(lambda x: x.tag == 'source')
        vid = n.find(lambda x: x.tag == 'video')
        return {'type': 'video', 'src': local_url(src.attrs.get('src')) if src else None,
                'width': int(vid.attrs.get('width') or 1280), 'height': int(vid.attrs.get('height') or 720),
                'radius': n.attrs.get('data-border-radius'), 'poster': local_url(vid.attrs.get('poster')) or None}
    if n.has('divider-wrap'):
        d = n.find(lambda x: 'divider' in x.cls or 'divider-small-border' in x.cls or 'divider-border' in x.cls)
        dst = styles(d) if d else {}
        return {'type': 'divider', 'height': dst.get('height'), 'line': bool(d and ('divider-border' in d.cls or 'divider-small-border' in d.cls)),
                'lineStyle': dst, 'classes': prefixed(n, 'height_'), 'dclasses': d.cls if d else []}
    if n.has('nectar-split-heading'):
        h = n.find(lambda x: re.fullmatch(r'h[1-6]|p', x.tag or ''))
        return {'type': 'split', 'tag': h.tag if h else 'h2', 'text': (h.attrs.get('aria-label') if h and h.attrs.get('aria-label') else (h.text() if h else '')).strip(),
                'style': st, 'classes': prefixed(n, 'font_')}
    if n.has('nectar-cta'):
        a = n.find(lambda x: x.tag == 'a')
        wrap = n.find(lambda x: x.has('link_wrap'))
        heading = n.find(lambda x: re.fullmatch(r'h[1-6]', x.tag or ''))
        return {'type': 'cta', 'style_name': n.attrs.get('data-style'), 'href': a.attrs.get('href') if a else None,
                'target': a.attrs.get('target') if a else None, 'label': re.sub(r'\s+', ' ', (a.text() if a else '')).strip(),
                'tag': heading.tag if heading else None, 'classes': [k for k in c if k.startswith(('border_', 'hover_', 'text_hover', 'font_size'))],
                'style': st, 'wrapStyle': styles(wrap) if wrap else {}}
    if n.has('nectar-meta-category-el'):
        items = []
        for x in n.find_all(lambda x: x.tag in ('a', 'span') and x.parent is n):
            items.append({'label': x.text().strip(), 'href': x.attrs.get('href')})
        return {'type': 'meta', 'items': items, 'classes': prefixed(n, 'alignment_', 'style-', 'direction-')}
    if n.has('nectar-scrolling-text'):
        chunk = n.find(lambda x: re.fullmatch(r'h[1-6]', x.tag or ''))
        return {'type': 'scrolling', 'text': chunk.text().strip() if chunk else '', 'classes': prefixed(n, 'font_', 'text_space')}
    if n.has('nectar-post-grid-wrap'):
        return {'type': 'postgrid'}
    if n.has('column-link'):
        return {'type': 'columnlink', 'href': n.attrs.get('href')}
    if n.has('wpb_text_column') or n.has('nectar-responsive-text'):
        # Sin .wpb_wrapper, Salient no anula el margen del último hijo (la lista conserva sus 30px).
        return {'type': 'html', 'html': clean_html(n).strip(), 'keepLast': n.has('wpb_text_column') and not n.find(lambda x: x.has('wpb_wrapper')),
                'classes': [k for k in c if k.startswith('font_') or k.startswith('vc_custom')],
                'style': {k: v for k, v in st.items() if k != 'color'}}
    if n.has('nectar-fancy-ul'):
        return {'type': 'list', 'icon': n.attrs.get('data-list-icon'), 'spacing': n.attrs.get('data-spacing'), 'html': clean_html(n).strip()}
    if n.has('nectar-badge'):
        return {'type': 'badge', 'text': n.text().strip()}
    return None


def children_of(container):
    out = []
    for ch in container.children:
        if not isinstance(ch, Node):
            continue
        e = element(ch)
        if e is not None:
            out.append(e)
        elif ch.tag not in ('script', 'style'):
            out.extend(children_of(ch))
    return out


def column(n):
    wrapper = n.find(lambda x: x.has('wpb_wrapper')) or n
    link = n.find(lambda x: x.tag == 'a' and x.has('column-link'))
    return {
        'span': next((int(k.split('-')[-1]) for k in n.cls if re.fullmatch(r'vc_col-sm-\d+', k)), 12),
        'xs': next((int(k.split('-')[-1]) for k in n.cls if re.fullmatch(r'vc_col-xs-\d+', k)), None),
        'classes': [k for k in n.cls if re.match(r'(padding-|el_spacing|nectar-sticky|centered-text|right_padding|left_padding|top_padding|bottom_padding|top_margin|bottom_margin|right_margin|left_margin|one-fourths|child_column|no-extra-padding)', k)],
        'animation': n.attrs.get('data-animation') or None,
        'bg': n.attrs.get('data-bg-color') if n.attrs.get('data-has-bg-color') == 'true' else None,
        'radius': n.attrs.get('data-border-radius'),
        'link': link.attrs.get('href') if link else None,
        'children': children_of(wrapper),
    }


def row(n):
    st = styles(n)
    bgimg = None
    bgnode = n.find(lambda x: x.has('row-bg') and 'using-image' in x.cls)
    if bgnode:
        m = re.search(r'url\(([^)]+)\)', bgnode.attrs.get('style', ''))
        bgimg = {'src': local_url(m.group(1).strip('\'"')) if m else None, 'style': styles(bgnode)}
    bgvid = None
    vwrap = next((ch for ch in n.children if isinstance(ch, Node) and ch.has('nectar-video-wrap')), None)
    if vwrap:
        src = vwrap.find(lambda x: x.tag == 'source')
        if src:
            bgvid = {'src': local_url(src.attrs.get('src'))}
    wrap = n.find(lambda x: x.has('row_col_wrap_12') or x.has('row_col_wrap_12_inner'))
    cols = [column(c) for c in (wrap.children if wrap else []) if isinstance(c, Node) and c.has('wpb_column')]
    text = 'light' if wrap and wrap.has('light') else 'dark'
    return {
        'type': 'row',
        'inner': n.has('inner_row'),
        'fullWidth': 'section' if n.has('full-width-section') else ('content' if n.has('full-width-content') else None),
        'bg': st.get('--row-bg-color'),
        'bgImage': bgimg,
        'bgVideo': bgvid,
        'padTop': st.get('padding-top'), 'padBottom': st.get('padding-bottom'),
        'classes': [k for k in n.cls if k.startswith(('vc_row-o', 'column-margin', 'right_padding', 'left_padding', 'top_padding', 'bottom_padding', 'top_margin', 'bottom_margin'))],
        'columnMargin': n.attrs.get('data-column-margin'),
        'text': text,
        'cols': cols,
    }


CUSTOM = {}


def apply_custom(node):
    """Aplica las reglas .vc_custom_* (márgenes definidos en el <style> de la página) al estilo del elemento."""
    if isinstance(node, dict):
        for c in node.get('classes', []):
            if c in CUSTOM:
                node.setdefault('style', {}).update(CUSTOM[c])
        for v in node.values():
            apply_custom(v)
    elif isinstance(node, list):
        for v in node:
            apply_custom(v)


def main(path):
    b = Builder()
    source = open(path, encoding='utf-8').read()
    for name, body in re.findall(r'\.(vc_custom_\d+)\{([^}]*)\}', source):
        CUSTOM[name] = {k.strip(): v.replace('!important', '').strip() for k, v in (d.split(':', 1) for d in body.split(';') if ':' in d)}
    b.feed(source)
    root = b.root
    extra = root.find(lambda x: x.attrs.get('id') == 'portfolio-extra')
    rows = [row(ch) for ch in extra.children if isinstance(ch, Node) and ch.has('wpb_row')]
    apply_custom(rows)
    title = root.find(lambda x: x.tag == 'title')
    desc = root.find(lambda x: x.tag == 'meta' and x.attrs.get('name') == 'description')
    og = root.find(lambda x: x.tag == 'meta' and x.attrs.get('property') == 'og:image')
    print(json.dumps({'title': title.text().strip() if title else '', 'description': desc.attrs.get('content') if desc else '',
                      'ogImage': og.attrs.get('content') if og else None, 'rows': rows}, ensure_ascii=False, indent=1))


main(sys.argv[1])
