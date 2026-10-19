"""Generate local WebP derivatives. Requires Pillow; originals are never overwritten.
Run from the repository root: python3 scripts/optimize_images.py
"""
from pathlib import Path
from PIL import Image, ImageOps

OUTPUT = Path('static/assets/optimized')
OUTPUT.mkdir(parents=True, exist_ok=True)
photos = [p for p in Path('static/assets/img').glob('*') if p.stem in {'photo', 'background', 'activity1', 'activity2', 'activity3'}]
for source in photos + list(Path('publication').glob('*.png')):
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    is_paper = source.parent.name == 'publication'
    size = (1800, 1800) if is_paper else ((560, 700) if source.stem == 'photo' else (1600, 1100))
    image.thumbnail(size)
    image.save(OUTPUT / (source.stem + '.webp'), 'WEBP', quality=86)
    if is_paper:
        image.thumbnail((360, 260))
        image.save(OUTPUT / (source.stem + '-thumb.webp'), 'WEBP', quality=82)
print('WebP derivatives updated. Upload static/assets/optimized/ with your content changes.')
