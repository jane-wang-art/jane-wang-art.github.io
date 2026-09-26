"""Build display assets from a pinned, owner-published archive. Never change the original repository."""
from pathlib import Path
import hashlib, io, json, os, urllib.request, time
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'source/_data/gallery.json').read_text())
assert data['source_repository'] == 'jane-wang-art/jane-frank-artwork'
commit = data['source_commit']
assert len(commit) == 40 and all(c in '0123456789abcdef' for c in commit)
records = []
for series in data['series']:
    target = ROOT / 'source/images' / series['id']
    target.mkdir(parents=True, exist_ok=True)
    for page in series['pages']:
        destination = target / (page['id'] + '.png')
        if destination.exists():
            raw = destination.read_bytes()
        elif os.environ.get('ARTWORK_LOCAL_DIR'):
            raw = (Path(os.environ['ARTWORK_LOCAL_DIR']) / (page['id'] + '.png')).read_bytes()
        else:
            url = f"https://raw.githubusercontent.com/{data['source_repository']}/{commit}/{page['source_path']}"
            for attempt in range(3):
                try:
                    req = urllib.request.Request(url, headers={'User-Agent': 'JaneWang-HexoGallery/1.0'})
                    with urllib.request.urlopen(req, timeout=60) as response:
                        raw = response.read(5_000_001)
                    break
                except OSError:
                    if attempt == 2: raise
                    time.sleep(2 ** attempt)
        if len(raw) > 5_000_000 or hashlib.sha256(raw).hexdigest() != page['sha256']:
            raise ValueError(f"Unapproved or damaged artwork: {page['id']}")
        image = Image.open(io.BytesIO(raw))
        if image.format != 'PNG' or image.size != (page['width'], page['height']):
            raise ValueError('Unexpected image format/dimensions')
        image.load()
        destination.write_bytes(raw)
        for width in (640, 1122):
            resized = image.convert('RGB')
            resized.thumbnail((width, 5000), Image.Resampling.LANCZOS)
            resized.save(target / f"{page['id']}-{width}.webp", 'WEBP', quality=88, method=6)
        records.append({'file': str(destination.relative_to(ROOT / 'source')), 'sha256': page['sha256'], 'source': page['source_path']})
        print(f"Verified original and prepared display sizes: {series['id']}/{page['id']}")
(ROOT / 'source/images/manifest.json').write_text(json.dumps({'source_repository':data['source_repository'], 'source_commit':commit, 'originals':records, 'derivatives':'Proportional WebP display copies; original PNG files retained unchanged.'},ensure_ascii=False,indent=2)+'\n')
