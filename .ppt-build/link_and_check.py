import json,zipfile,re,hashlib,posixpath
from pathlib import Path
from lxml import etree as E
ROOT=Path(__file__).resolve().parent.parent
B=ROOT/'.ppt-build'
M=json.loads((B/'manifest.json').read_text(encoding='utf-8-sig'))
S=json.loads((B/'web-source.json').read_text(encoding='utf-8-sig'))
N={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
REL='http://schemas.openxmlformats.org/package/2006/relationships'
ids={s['id']:s['number'] for s in M['slides']}
with zipfile.ZipFile(B/'candidate.pptx') as z: files={n:z.read(n) for n in z.namelist()}
for s in M['slides']:
    i=s['number']; f=f'ppt/slides/slide{i}.xml'; rf=f'ppt/slides/_rels/slide{i}.xml.rels'
    xml=E.fromstring(files[f]); rel=E.fromstring(files[rf]) if rf in files else E.Element('{'+REL+'}Relationships',nsmap={None:REL})
    for j,l in enumerate(x for x in M['links'] if x['from']==s['id']):
        objects=xml.xpath('//p:cNvPr[@name=$n]',namespaces=N,n=l['name'])
        assert len(objects)==1,(s,l,objects)
        rid='rIdNav'+str(j)
        h=E.SubElement(objects[0],'{'+N['a']+'}hlinkClick')
        h.set('{'+N['r']+'}id',rid);h.set('action','ppaction://hlinksldjump');h.set('tooltip',next(v['title'] for v in M['slides'] if v['id']==l['to']) or '首页')
        r=E.SubElement(rel,'{'+REL+'}Relationship');r.set('Id',rid);r.set('Type',N['r']+'/slide');r.set('Target','slide'+str(ids[l['to']])+'.xml')
    transition=xml.find('p:transition',N)
    if transition is None:
        transition=E.Element('{'+N['p']+'}transition')
        timing=xml.find('p:timing',N)
        xml.insert(list(xml).index(timing) if timing is not None else len(xml),transition)
    transition.set('advClick','0')
    files[f]=E.tostring(xml,xml_declaration=True,encoding='UTF-8',standalone=True)
    files[rf]=E.tostring(rel,xml_declaration=True,encoding='UTF-8',standalone=True)
with zipfile.ZipFile(B/'candidate-linked.pptx','w',zipfile.ZIP_DEFLATED) as z:
    for n,b in files.items():z.writestr(n,b)
def norm(t):return re.sub(r'\s+','',t)
texts={s['id']:norm(''.join(E.fromstring(files[f"ppt/slides/slide{s['number']}.xml"]).xpath('//a:t/text()',namespaces=N))) for s in M['slides']}
checks=[]
def check(name,result):
    checks.append({'name':name,'passed':bool(result)})
    assert result,name
for route,v in S['rendered'].items():
    combined=''.join(t for id,t in texts.items() if id==route or id.startswith(route+'::'))
    for n in v['notes']:
        for b in n['blocks']:
            check(route+' / '+b['title'],norm(b['title']) in combined and norm(b['text']) in combined)
        if n.get('sequence'):
            for b in n['sequence']['nodes']:check(route+' / '+b['title'],norm(b['text']) in combined)
        if n.get('caption'):check(route+' / caption',norm(n['caption']) in combined)
for route,pg in S['model']['pages'].items():
    check('fragment '+route,route in ids)
    sec=S['model']['lesson']['sections'][pg['section']]
    for f in sec['flows']:
        g=S['model']['lesson']['flows'][f];prefix=f'flow/{f}/{route}'
        for qi,q in enumerate(g['items']):
            check(prefix+' prompt '+q['questionId'],norm(q['prompt']) in texts[prefix+'::q'+str(qi)])
            answer=''.join(t for id,t in texts.items() if id==prefix+'::a'+str(qi) or id.startswith(prefix+'::a'+str(qi)+'::'))
            # Every exact paragraph is present; slide headers/nav interrupt concatenation at page breaks.
            check(prefix+' answer '+q['questionId'],all(norm(para) in answer for para in S['answers'][q['questionId']].split('\n') if para.strip()))
            check(prefix+' return '+q['questionId'],any(l['from']==prefix+'::q'+str(qi) and l['to']==route for l in M['links']))
for q in S['model']['lesson']['reviewItems']:check('review '+q['questionId'],norm(q['answer']) in texts['review'])
embedded={hashlib.sha256(b).hexdigest() for n,b in files.items() if n.startswith('ppt/media/')}
for pg in S['model']['pages'].values():
    a=S['model']['assets'][pg['asset']];check('original image '+pg['asset'],hashlib.sha256((ROOT/a['path']).read_bytes()).hexdigest() in embedded)
for name in ['课标截图.png','assets/teacher/sui_canal_granary_map.png','assets/lesson/tang-thinking-point.png']:
    check('original image '+name,hashlib.sha256((ROOT/name).read_bytes()).hexdigest() in embedded)
seen={'title'}
while True:
    new=seen|{l['to'] for l in M['links'] if l['from'] in seen}
    if new==seen:break
    seen=new
check('all slides reachable',seen==set(ids))
check('all hyperlinks internal',all(l['to'] in ids for l in M['links']))
(B/'content-link-checks.json').write_text(json.dumps({'slides':len(ids),'internalLinks':len(M['links']),'checks':checks},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'PASS: {len(checks)} content/image/navigation checks, {len(ids)} reachable slides, {len(M["links"])} internal hyperlinks')
