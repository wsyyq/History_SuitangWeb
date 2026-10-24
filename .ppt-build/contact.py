from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
import json
B=Path(__file__).resolve().parent
slides=json.loads((B/'manifest.json').read_text(encoding='utf-8-sig'))['slides']
for start in range(0,len(slides),16):
    canvas=Image.new('RGB',(1280,800),'#ffffff');draw=ImageDraw.Draw(canvas)
    for j,s in enumerate(slides[start:start+16]):
        im=Image.open(B/'render'/f'{s["number"]:03}.png').resize((320,180))
        x=j%4*320;y=j//4*200;canvas.paste(im,(x,y));draw.text((x+4,y+181),str(s['number']),fill='black')
    canvas.save(B/f'contact-{start//16+1:02}.png')
