from pathlib import Path
from PIL import Image
from html.parser import HTMLParser
import re,json,hashlib,subprocess
R=Path(__file__).resolve().parents[1];out=R/'review/stage7'
model=json.loads((out/'rehearsal/active-model.json').read_text(encoding='utf8'))
class HTML(HTMLParser):
 def __init__(self):super().__init__();self.refs=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  for k in ['src','href']:
   if k in d and not d[k].startswith('#'):self.refs.append(d[k])
p=HTML();p.feed((R/'index.html').read_text(encoding='utf8'))
refs=p.refs+[a['path'] for a in model['assets'].values()]+['./课标截图.png','./assets/teacher/sui_canal_granary_map.png','./assets/lesson/tang-thinking-point.png']
for f in (R/'css').glob('*.css'):
 for url in re.findall(r'url\([\'"]?([^\)\'\"]+)',f.read_text(encoding='utf8')):
  if not url.startswith('data:'):refs.append(str((f.parent/url).relative_to(R)))
checks=[]
for ref in sorted(set(refs)):
 assert not re.match(r'https?://|//',ref),ref
 parts=Path(ref).parts;current=R
 for part in parts:
  if part=='.':continue
  assert part in [p.name for p in current.iterdir()],f'Case mismatch: {ref}'
  current=current/part
 assert current.is_file() and current.stat().st_size>0,ref
 checks.append({'path':ref,'bytes':current.stat().st_size,'caseExact':True,'sha256':hashlib.sha256(current.read_bytes()).hexdigest()})
images=[]
for f in list((R/'assets').rglob('*.png'))+[R/'课标截图.png']:
 with Image.open(f) as im:im.verify()
 with Image.open(f) as im:images.append({'path':str(f.relative_to(R)),'size':im.size})
documents=['AGENTS.md','MX_FIX01_REVIEW.md','MX_FIX01_CONTENT_AUDIT.md','MX_FIX02_REVIEW.md','STAGE5_CONTENT_AUDIT.md','STAGE6_CONTENT_AUDIT.md','隋唐讲解框架.md','隋唐讲解原文.md']+[str(p.relative_to(R)) for p in (R/'.agents/skills/sui-tang-lesson').rglob('*.md')]
readlog=[{'path':f,'characters':len((R/f).read_text(encoding='utf8')),'sha256':hashlib.sha256((R/f).read_bytes()).hexdigest()} for f in documents]
pages=[{'route':pid,'module':p['module'],'section':p['section'],'index':p['index'],'asset':model['assets'][p['asset']]['path'],'title':model['assets'][p['asset']]['title'],'pdfPage':model['assets'][p['asset']]['pdfPage'],'printedPage':model['assets'][p['asset']]['printedPage'],'flows':model['sections'][p['section']]['flows']} for pid,p in model['pages'].items()]
result={'status':'passed','references':checks,'decodedImages':images,'readDocuments':readlog,'pages':pages,'htmlCheck':'Python HTMLParser + browser duplicate-ID checks; no Nu/W3C validator installed or claimed','gitHead':subprocess.check_output(['git','-c','core.fsmonitor=false','rev-parse','HEAD'],cwd=R,text=True).strip()}
(out/'source-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
(out/'ACTIVE_ROUTES.md').write_text('# 第七阶段活动教材路线\n\n|路由|模块/子目|素材|PDF/印刷页|题组|\n|---|---|---|---|---|\n'+'\n'.join('|'+p['route']+'|'+p['module']+'/'+p['section']+'|'+p['asset']+'|'+str(p['pdfPage'])+'/'+str(p['printedPage'])+'|'+','.join(p['flows'])+'|' for p in pages),encoding='utf8')
print(json.dumps({'status':'passed','references':len(checks),'decodedImages':len(images),'pages':len(pages)}))
