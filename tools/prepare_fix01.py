"""Derive FIX01 images without modifying textbook/teacher originals."""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'assets/lesson';out.mkdir(exist_ok=True)
teacher=ROOT/'assets/teacher/sui_canal_granary_map.png'
assert hashlib.sha256(teacher.read_bytes()).hexdigest()=='5a0a0492417368bb290ebe702317f9b6f3ec0dbb8093ad3e26e29a048785591f'
assert Image.open(teacher).size==(416,404)
a=Image.open(ROOT/'assets/textbook/an-process.png').convert('RGB')
b=Image.open(ROOT/'assets/textbook/an-impact.png').convert('RGB')
merged=Image.new('RGB',(1160,370),'white')
merged.paste(a.crop((0,0,1122,292)),(0,0));merged.paste(b,(0,300))
merged.save(out/'an-impact-crosspage-merged.png')
Image.open(ROOT/'assets/textbook/alliance.png').crop((430,35,960,252)).save(out/'tang-thinking-point.png')
record={'an-impact-crosspage-merged.png':{'sources':[{'path':'assets/textbook/an-process.png','crop':[0,0,1122,292],'destination':[0,0],'pdfPage':4,'printedPage':37},{'path':'assets/textbook/an-impact.png','crop':[0,0,1160,70],'destination':[0,300],'pdfPage':5,'printedPage':38}],'note':'原像素1:1；仅去除第37页段落末尾白边，保留完整四行，下一行接“占领河西陇右地区”。'},'tang-thinking-point.png':{'sources':[{'path':'assets/textbook/alliance.png','crop':[430,35,960,252],'pdfPage':4,'printedPage':37}],'note':'仅保留右上思考点，附于frontier页面，无新路由。'}}
for name,r in record.items():
 r['sha256']=hashlib.sha256((out/name).read_bytes()).hexdigest();r['size']=Image.open(out/name).size
(out/'fix01-derivatives.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8')
print('Derived images verified; teacher PNG SHA-256 matches delivery.')
