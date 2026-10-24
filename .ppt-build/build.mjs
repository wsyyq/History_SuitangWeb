import fs from 'node:fs/promises';
import path from 'node:path';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
const root=path.resolve('.'), dir=path.join(root,'.ppt-build');
const src=JSON.parse(await fs.readFile(path.join(dir,'web-source.json'),'utf8'));
const {lesson:L,assets:A,pages:P}=src.model, R=src.rendered;
const p=Presentation.create({slideSize:{width:1280,height:720}}), slides=[], links=[];
const C={paper:'#f6f0e4',ink:'#28251f',red:'#8b3d2e',blue:'#35616b',muted:'#786c59',line:'#d7c8ae',white:'#fffdf7'};
function text(s,t,x,y,w,h,size=26,opts={}){const q=s.shapes.add({name:opts.name||'text',geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:opts.fill||'none',line:{fill:'none',width:0}});q.text=t||'';q.text.style={typeface:'Microsoft YaHei',fontSize:size,color:opts.color||C.ink,bold:opts.bold||false,alignment:opts.center?'center':'left',verticalAlignment:opts.middle?'middle':'top',wrap:'square',autoFit:'none',insets:opts.pad||0};return q;}
function box(s,x,y,w,h,fill=C.white,line=C.line){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:1}});}
function button(d,t,dest,x,y,w=110,h=45,primary=false){let name='link-'+links.length;let q=text(d.s,t,x,y,w,h,18,{name,fill:primary?C.red:'#e9dfcb',color:primary?'#ffffff':C.ink,center:true,middle:true,pad:5});links.push({from:d.id,name,to:dest});return q;}
function slide(id,title,sub='',module){const s=p.slides.add();s.background.fill=C.paper;const d={id,s,title,module};slides.push(d);box(s,0,0,132,720,'#e9dfcb','#e9dfcb');button(d,'历','title',35,24,62,62,true);button(d,'课堂脉络','outline',11,105);if(module)button(d,'模块菜单',module,11,162);text(s,title,164,29,1076,80,title.length>30?30:38,{bold:true,color:C.red});text(s,sub,164,111,1076,34,17,{color:C.muted});text(s,'中外历史纲要 · 上',164,686,500,22,14,{color:C.muted});if(module){const m=L.modules.find(m=>m.id===module);text(s,`${m.title} · 参考 ${m.targetMinutes} 分钟`,850,686,390,22,14,{color:C.muted});}s.speakerNotes.text=`来源：当前仓库 index.html#${id.split('::')[0]}。内容、教材图片及问题定稿沿用网页。`;return d;}
function image(d,asset,x,y,w,h){const pp=path.resolve(root,asset.path);return fs.readFile(pp).then(b=>{const scale=Math.min(w/asset.width,h/asset.height),iw=asset.width*scale,ih=asset.height*scale;d.s.images.add({blob:b,contentType:'image/png',alt:asset.title||asset.alt||'',position:{left:x+(w-iw)/2,top:y+(h-ih)/2,width:iw,height:ih},fit:'contain'});return {x:x+(w-iw)/2,y:y+(h-ih)/2,scale};});}
function split(t,limit=300){let out=[],part='',used=0;for(const line of t.split('\n')){const lines=Math.max(1,Math.ceil(line.length/36));if(part&&(part.length+line.length>limit||used+lines>11)){let carry='';const rows=part.trimEnd().split('\n');const last=rows.at(-1);if(last&&last.length<32&&!/[。？！；：）]$/.test(last)&&rows.length>1){carry=rows.pop();part=rows.join('\n');}out.push(part.trim());part=carry;used=carry?Math.ceil(carry.length/36):0;}part+=(part?'\n':'')+line;used+=lines;}if(part.trim())out.push(part.trim());return out;}function nav(d,items){let y=236;for(const [label,to] of items.filter(a=>a[1])){button(d,label.replace(/[←→↩]/g,'').trim(),to,11,y,110,52,label.includes('揭示')||label.includes('下一题'));y+=66;}}
function pageNav(d,route,i,chain){const n=R[route].nav.filter(n=>!n.href.startsWith('flow/'));const up=n.find(n=>n.label.startsWith('返回'));const prev=n.find(n=>n.label.includes('上一'));const next=n.find(n=>n.label.includes('下一'));nav(d,[[up?.label,up?.href],['上一页',i?chain[i-1]:prev?.href],['下一页',i<chain.length-1?chain[i+1]:next?.href]]);}
const home=slide('title','', '');text(home.s,'高中历史 · 第六课',185,155,510,40,22,{color:C.blue});text(home.s,R.title.title,185,213,560,160,52,{bold:true,color:C.red});text(home.s,'循着统一、繁荣与分合的脉络，\n走进隋唐历史。',185,400,560,94,26);button(home,'开始授课　→','standard',185,522,250,58,true);text(home.s,'中外历史纲要 · 上　/　40 分钟课堂',185,616,580,32,20,{color:C.muted});await image(home,A['canal-photo'],770,168,450,390);text(home.s,'大运河今貌 · 教材原图\nPDF 第 1/6 页｜教材第 34 页',780,582,430,66,19,{color:C.muted});
for(const id of ['standard','standards']){const d=slide(id,'课标要求','课程标准 · 教师提供截图',id==='standards'?'standards':null);const b=await fs.readFile(path.join(root,'课标截图.png'));const im={width:b.readUInt32BE(16),height:b.readUInt32BE(20)};await image(d,{path:'课标截图.png',width:im.width,height:im.height,title:'课程标准 · 教师提供截图'},170,167,1060,475);nav(d,R[id].nav.map(n=>[n.label,n.href]));}
const outline=slide('outline','课堂脉络','选择一个模块，开始阅读与思考。');let cumulative=0;L.modules.forEach((m,i)=>{const x=164+(i%3)*360,y=171+Math.floor(i/3)*248;cumulative+=m.targetMinutes;box(outline.s,x,y,340,225);text(outline.s,`0${i+1} / ${m.eyebrow}`,x+18,y+14,302,30,18,{color:C.blue});button(outline,m.title,m.id,x+18,y+52,302,47,true);text(outline.s,m.description,x+18,y+115,302,58,20);text(outline.s,`参考 ${m.targetMinutes} 分钟 · 累计 ${cumulative} 分钟`,x+18,y+185,302,28,17,{color:C.muted});});nav(outline,R.outline.nav.map(n=>[n.label,n.href]));
for(const m of L.modules.filter(m=>m.sections.length)){const d=slide(m.id,m.title,`模块 0${L.modules.indexOf(m)+1} / ${m.eyebrow}`,m.id);text(d.s,m.description,175,170,1040,50,26);m.sections.forEach((sid,i)=>{let sec=L.sections[sid];button(d,`0${i+1}　${sec.title}　　${sec.assets.length} 个教材片段　→`,sid+'--'+sec.assets[0],175,260+i*116,1040,85,i===0);});nav(d,R[m.id].nav.map(n=>[n.label,n.href]));}
const review=slide('review','内容回顾','四项题答直接展示', 'review');L.reviewItems.forEach((q,i)=>{let x=164+i%2*548,y=163+Math.floor(i/2)*254;box(review.s,x,y,528,242);text(review.s,`回顾 0${i+1}　${q.prompt}`,x+16,y+13,496,58,22,{bold:true,color:C.red});text(review.s,q.answer,x+16,y+79,496,155,q.questionId==='R02'?18:21);});nav(review,[['返回上一级','outline'],['上一模块','fall'],['结束回顾','outline']]);
const chains={};
for(const [route,pg] of Object.entries(P)){
 const a=A[pg.asset],sec=L.sections[pg.section],notes=R[route].notes;
 const payload=[{kind:'image',asset:a}];if(pg.asset==='frontier')payload.push({kind:'image',asset:{path:'assets/lesson/tang-thinking-point.png',title:'教材思考点：隋唐盛世形成的原因有哪些？',width:530,height:217},caption:'教材 PDF 第4/6页｜印刷第37页 · 保留思考点'});
 for(const n of notes){let t=n.blocks.map(b=>b.title+'\n'+b.text).join('\n\n');if(n.sequence)t+=(t?'\n\n':'')+n.sequence.title+'\n\n'+n.sequence.nodes.map(b=>b.title+'\n'+b.text).join('\n\n');if(n.caption)t+='\n\n'+n.caption;for(const part of split(t,290))payload.push({kind:'note',title:n.title,text:part});}
 chains[route]=payload.map((_,i)=>i?route+'::'+i:route);
 for(let i=0;i<payload.length;i++){const v=payload[i],d=slide(chains[route][i],v.kind==='image'?a.title:v.title,`${sec.title} / 教材片段 ${pg.index+1}/${sec.assets.length}　PDF 第 ${a.pdfPage}/6 页｜教材第 ${a.printedPage} 页`,pg.module);d.route=route;pageNav(d,route,i,chains[route]);if(v.kind==='image'){await image(d,v.asset,170,163,1060,pg.asset==='map-669'?350:sec.flows.length?388:470);if(v.caption)text(d.s,v.caption,175,571,1050,38,19,{color:C.muted});}else text(d.s,v.text,180,169,1040,sec.flows.length?390:485,27);
 sec.flows.forEach((f,j)=>button(d,L.flows[f].title+' ↗',`flow/${f}/${route}::q0`,170,562+j*35,1060,30));
 // Direct fragment selection duplicates the website selector without adding lesson content.
 sec.assets.forEach((a,j)=>button(d,String(j+1),sec.id+'--'+a,14+j%3*35,590+Math.floor(j/3)*34,31,29));
 }
}
// Map selection states retain the original full bitmap and only outline its text labels.
const mapRoute='tang-relations--map-669',base=slides.find(d=>d.id===mapRoute),mapA=A['map-669'];
for(const state of [null,...L.map669.objects]){
 const d=state?slide(mapRoute+'::map-'+state.id,mapA.title,'定位示意，非政治边界','tang'):base;
 if(state)pageNav(d,mapRoute,0,[mapRoute]);
 // On the main map add object links; detail states give the selected explanation and a larger map.
 const pos=state?await image(d,mapA,170,151,1060,383):{scale:Math.min(1060/mapA.width,350/mapA.height),x:170+(1060-mapA.width*Math.min(1060/mapA.width,350/mapA.height))/2,y:163+(350-mapA.height*Math.min(1060/mapA.width,350/mapA.height))/2};
 if(state){for(const b of state.boxes)box(d.s,pos.x+b[0]*pos.scale,pos.y+b[1]*pos.scale,b[2]*pos.scale,b[3]*pos.scale,'none',C.red);text(d.s,state.name+' · '+state.position+'\n'+state.text,175,544,1050,82,23);text(d.s,'朱砂框只定位文字，不代表疆域。',175,662,1050,22,18,{color:C.red});}
 L.map669.objects.forEach((o,j)=>button(d,o.name,mapRoute+'::map-'+o.id,170+j*208, state?630:525,196,29));button(d,'清除定位',mapRoute,1002,state?630:525,196,29);
 if(state)button(d,'交往方式问答 ↗',`flow/relations/${mapRoute}::q0`,11,500,110,64);
}
for(const [route,pg] of Object.entries(P)){for(const fid of L.sections[pg.section].flows){const g=L.flows[fid],prefix=`flow/${fid}/${route}`;for(let qi=0;qi<g.items.length;qi++){
const q=g.items[qi],qid=prefix+'::q'+qi,aid=prefix+'::a'+qi,parts=q.image?[src.answers[q.questionId]]:split(src.answers[q.questionId],280);
const d=slide(qid,g.title,`课堂问题 / 第四级　${qi+1}/${g.items.length}`,pg.module);text(d.s,q.prompt,190,240,1020,210,40,{bold:true,color:C.blue});nav(d,[['返回原教材页',route],['上一题',qi?prefix+'::q'+(qi-1):null],['揭示答案',aid]]);
for(let k=0;k<parts.length;k++){const ad=slide(k?aid+'::'+k:aid,q.prompt,`课堂问题 / 第四级　${qi+1}/${g.items.length}`,pg.module);nav(ad,[['返回原教材页',route],['上一题',qi?prefix+'::q'+(qi-1):null],[k<parts.length-1?'继续答案':qi<g.items.length-1?'下一题':'完成返回',k<parts.length-1?aid+'::'+(k+1):qi<g.items.length-1?prefix+'::q'+(qi+1):route]]);if(q.image){text(ad.s,parts[k],185,190,500,300,32,{bold:true});await image(ad,q.image,720,175,480,450);}else text(ad.s,parts[k],185,180,1030,470,28);}
}}}
// Preserve displayed map-reading instruction and provenance on a reachable continuation.
const md=slide(mapRoute+'::guide','唐朝前期形势和边疆各族分布图（669年）及古今地名表','地图阅读','tang');text(md.s,'先选择对象，再向下读图。朱砂框只定位文字，不代表疆域。可使用白板放大、移动；图题、图例与全部年代注记均保留。\n\n'+L.map669.sourceRef+' · 定位示意，非政治边界',180,210,1030,350,29);nav(md,[['返回教材',mapRoute],['交往方式问答',`flow/relations/${mapRoute}::q0`]]);button(base,'读图说明',md.id,11,510,110,50);
// Aliases for direct review selection keep all four answers visible.
for(const l of links)if(l.to?.startsWith('review/'))l.to='review';
const ids=new Set(slides.map(d=>d.id));for(const l of links)if(!ids.has(l.to))throw Error('Missing target '+JSON.stringify(l));
await fs.mkdir(path.join(dir,'render'),{recursive:true});
await (await PresentationFile.exportPptx(p)).save(path.join(dir,'candidate.pptx'));
await fs.writeFile(path.join(dir,'manifest.json'),JSON.stringify({slides:slides.map((d,i)=>({id:d.id,title:d.title,number:i+1})),links},null,2));
console.log('Exported '+slides.length+' slides; '+links.length+' internal links');
for(let i=0;i<slides.length;i++){const blob=await p.export({slide:slides[i].s,format:'png',scale:1});await fs.writeFile(path.join(dir,'render',String(i+1).padStart(3,'0')+'.png'),new Uint8Array(await blob.arrayBuffer()));if(i%20===0)console.log('Rendered '+(i+1)+'/'+slides.length);}



