"""Lista los textos traducibles de un modelo de proyecto (en el orden en que aparecen, sin repetir).

Uso: python3 tools/projects/strings.py src/data/projects/<slug>.json
"""
import json, sys

KINDS = {'html': 'html', 'list': 'html', 'split': 'text', 'cta': 'label', 'scrolling': 'text', 'badge': 'text', 'img': 'alt'}


def strings(model):
    out = [model['title']] + ([model['description']] if model.get('description') else [])

    def walk(n):
        if isinstance(n, dict):
            key = KINDS.get(n.get('type'))
            if key and n.get(key):
                out.append(n[key])
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(model['rows'])
    return list(dict.fromkeys(out))


if __name__ == '__main__':
    for s in strings(json.load(open(sys.argv[1]))):
        print(json.dumps(s, ensure_ascii=False))
