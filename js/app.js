(() => {
  'use strict';
  const {modules,sections,flows,reviews}=window.LESSON;
  const assets=window.TEXTBOOK_ASSETS, main=document.querySelector('main');
  const top=['title','standard','outline'];
  const moduleById=Object.fromEntries(modules.map(m=>[m.id,m]));
  const pages=Object.fromEntries(Object.values(sections).flatMap(s=>s.assets.map((asset,i)=>{
    const id=`${s.id}--${asset}`;return [id,{id,asset,section:s.id,module:s.module,index:i}];
  })));
  let current,nav={},savedScroll=new Map();
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const link=(id,label,cls='nav-button')=>`<a class="${cls}" href="#${esc(id)}">${esc(label)}</a>`;
  const first=s=>`${s}--${sections[s].assets[0]}`;
  const flowRoute=(f,p)=>`flow/${f}/${p}`;
  function parse(hash){
    const id=hash.replace(/^#/,'')||'title';
    if(top.includes(id))return {id,level:1};
    if(moduleById[id])return {id,level:2,module:id};
    if(pages[id])return {...pages[id],level:3};
    const [kind,flow,origin]=id.split('/');
    if(kind==='flow'&&flows[flow]&&pages[origin]&&sections[pages[origin].section].flows.includes(flow))return {id,level:4,flow,origin,module:pages[origin].module,section:pages[origin].section};
    const match=id.match(/^review\/([0-3])$/);
    if(match)return {id,level:2,module:'review',reviewIndex:Number(match[1])};
    return null;
  }
  function head(k,title,sub=''){return `<div class="page-head"><div><div class="eyebrow">${k}</div><h1 tabindex="-1">${title}</h1></div>${sub?`<p>${sub}</p>`:''}</div>`;}
  function renderStandards(){return `<figure class="standards-image"><img src="./课标截图.png" alt="课程标准：三国两晋南北朝的民族交融与隋唐大一统的发展"><figcaption>课程标准 · 教师提供截图</figcaption></figure>`;}
  function moduleCards(){return `<div class="module-grid">${modules.map((m,i)=>`<a class="module-card" href="#${m.id}"><span class="number">0${i+1} / ${m.eyebrow}</span><span class="arrow" aria-hidden="true">↗</span><h2>${m.title}</h2><p>${m.description}</p></a>`).join('')}</div>`;}
  function configureNav(s){
    nav={};let siblings=[];
    if(s.level===1){siblings=top;nav.up=s.id==='title'?null:'title';}
    else if(s.level===2){siblings=modules.map(m=>m.id);nav.up='outline';if(s.module==='review'){siblings=reviews.map((_,i)=>`review/${i}`);nav.prev=s.reviewIndex>0?`review/${s.reviewIndex-1}`:null;nav.next=(s.reviewIndex??0)<3?`review/${(s.reviewIndex??0)+1}`:null;return;}const m=moduleById[s.module];nav.down=m.sections.length?first(m.sections[0]):null;}
    else if(s.level===3){siblings=moduleById[s.module].sections.flatMap(id=>sections[id].assets.map(a=>`${id}--${a}`));nav.up=s.module;nav.down=sections[s.section].flows.length?flowRoute(sections[s.section].flows[0],s.id):null;}
    else {siblings=sections[s.section].flows.map(f=>flowRoute(f,s.origin));nav.up=s.origin;}
    const index=siblings.indexOf(s.id);nav.prev=siblings[index-1]||null;nav.next=siblings[index+1]||null;
    if(s.level===1&&s.id==='outline')nav.down='standards';
  }
  function renderNavigation(s){
    const control=(id,label,why)=>id?link(id,label):`<button class="nav-button" disabled title="${why}">${label}</button>`;
    document.querySelector('#navigation').innerHTML=control(nav.up,s.level===4?'返回原教材页':s.level===3?'返回本模块菜单':'返回上一级', '当前已是首页')+control(nav.prev,'← 上一页','已是本级第一页')+control(nav.next,'下一页 →','已是本级末页')+(s.level===3&&!nav.next?link(s.module,'完成本模块','primary'):'')+(nav.down?link(nav.down,s.level===3?'进入问题链':'进入下一级','primary'):'');
    const crumbs=[link('title','首页','crumb')];
    if(s.id!=='title')crumbs.push(link('outline','课堂脉络','crumb'));
    if(s.module)crumbs.push(link(s.module,moduleById[s.module].title,'crumb'));
    if(s.section)crumbs.push(link(first(s.section),sections[s.section].title,'crumb'));
    if(s.level===4)crumbs.push('<span>问题链占位</span>');
    else if(s.id==='standard')crumbs.push('<span>课标要求</span>');
    document.querySelector('#breadcrumbs').innerHTML=crumbs.join('<span aria-hidden="true">/</span>');
  }
  function render(){
    const incoming=parse(location.hash);
    if(!incoming){location.replace('#title');return;}
    const viewport=document.querySelector('#textbook-viewport');
    if(current?.level===3&&viewport)savedScroll.set(current.id,viewport.scrollTop);
    current=incoming;configureNav(current);const s=current;
    document.body.dataset.level=String(s.level);document.body.dataset.pageId=s.id;
    if(s.id==='title'){
      main.innerHTML=`<section class="hero"><div><div class="eyebrow">高中历史 · 第六课</div><h1>从隋唐盛世<span>到五代十国</span></h1><p>循着统一、繁荣与分合的脉络，<br>走进隋唐历史。</p>${link('standard','开始授课　→','primary')}<div class="course-meta" style="margin-top:40px">中外历史纲要 · 上　/　40 分钟课堂</div></div><figure class="hero-art"><img src="${assets['canal-photo'].path}" alt="教材插图：大运河今貌"><figcaption>大运河今貌 · 教材原图<br>PDF 第 1/6 页｜教材第 34 页</figcaption></figure></section>`;
    }else if(s.id==='standard'||s.module==='standards'){
      main.innerHTML=head(s.level===1?'课程导入 / 02':'模块 01 / 课标研读','课标要求')+renderStandards();
    }else if(s.id==='outline'){
      main.innerHTML=head('课程导入 / 03','课堂脉络','选择一个模块，开始阅读与思考。')+moduleCards();
    }else if(s.module==='review'){
      main.innerHTML=head('模块 06 / 二级内容','内容回顾','问题与答案直接呈现 · 本阶段保留待填充卡片')+`<div class="review-grid">${reviews.map((title,i)=>`<article id="review-card-${i}" class="review-card ${i===(s.reviewIndex??0)?'active':''}"><a href="#review/${i}" aria-label="选择回顾${i+1}：${title}"><span class="badge">回顾 0${i+1}</span><h2>${title}</h2></a><p>答案待填充<br>回顾内容待第五／六阶段核实与填充。</p></article>`).join('')}</div>`;
    }else if(s.level===2){
      const m=moduleById[s.module];main.innerHTML=head(`模块 0${modules.indexOf(m)+1} / ${m.eyebrow}`,m.title,m.description)+`<div class="section-menu">${m.sections.map((id,i)=>`<a class="section-link" href="#${first(id)}"><span>0${i+1}</span><strong>${sections[id].title}</strong><small>${sections[id].assets.length} 个教材片段</small><span aria-hidden="true">→</span></a>`).join('')}</div>`;
    }else if(s.level===3){
      const section=sections[s.section],asset=assets[s.asset];
      main.innerHTML=`<section class="reader-page">${head('教材研读 / 第三级',`${section.title}<small>${asset.title}</small>`)}<div class="reader-controls"><label for="fragment">教材片段</label><select id="fragment" aria-label="选择教材片段">${section.assets.map((a,i)=>`<option value="${section.id}--${a}" ${a===s.asset?'selected':''}>${i+1}/${section.assets.length} · ${assets[a].title}</option>`).join('')}</select><span class="source-label">PDF 第 ${asset.pdfPage}/6 页｜教材第 ${asset.printedPage} 页 · 阅读区可上下滚动</span></div><div class="reader-layout"><div id="textbook-viewport" tabindex="0" aria-label="教材阅读区，可上下滚动"><figure id="textbook-surface" data-asset-id="${asset.id}" style="--image-width:${asset.displayWidth}px"><img src="${asset.path}" alt="${asset.title}，教材第${asset.printedPage}页"><div id="annotation-layer" aria-hidden="true"></div></figure></div><div class="hotspots"><span class="label">${section.flows.length?'课堂问题 · 点选进入':'本段无四级问题入口'}　</span>${section.flows.map(f=>link(flowRoute(f,s.id),flows[f].title+' ↗','hotspot')).join('')}</div></div></section>`;
      main.querySelector('select').addEventListener('change',e=>{location.hash=e.target.value;});
      const img=main.querySelector('img');img.addEventListener('error',()=>{img.insertAdjacentHTML('afterend','<p class="image-error">教材图片加载失败，请检查本地素材文件是否完整。</p>');});
      const restore=()=>{document.querySelector('#textbook-viewport').scrollTop=savedScroll.get(s.id)||0;};
      img.addEventListener('load',restore,{once:true});if(img.complete)restore();
    }else if(s.level===4){
      const f=flows[s.flow];main.innerHTML=head('课堂问题 / 第四级','问题链')+`<section class="flow-box"><span class="badge">互动占位 · 尚未填充</span><h2>${f.title}</h2><p class="pending">互动内容将在后续阶段填充。</p><p>本阶段保留问题链入口；正式问题、答案与逐步揭示流程尚未启用。</p>${s.flow==='canal'?'<div class="missing-inline">待补素材：隋大运河—仓储—洛阳分布图</div>':''}${f.audits.length?'<p>相关解释尚待核实与教师确认。</p>':''}${link(s.origin,'返回触发此问题的教材片段','primary')}</section>`;
    }
    renderNavigation(s);main.scrollTop=0;
    const heading=main.querySelector('h1');if(heading)heading.focus({preventScroll:true});
    document.title=`${s.level===4?flows[s.flow].title:s.level===3?sections[s.section].title:s.module?moduleById[s.module].title:'从隋唐盛世到五代十国'} · 历史课堂`;
    window.dispatchEvent(new CustomEvent('lesson:navigate',{detail:{...s,interactionMode:'select'}}));
  }
  window.addEventListener('hashchange',render);
  document.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    const target=e.key==='ArrowRight'?nav.next:e.key==='ArrowLeft'?nav.prev:e.key==='Escape'?nav.up:null;
    if(target){e.preventDefault();location.hash=target;}
  });
  // Stage 3 can subscribe to lesson:navigate and mount an independent annotation layer.
  window.LessonApp={getState:()=>({...current}),getPages:()=>({...pages})};
  render();
})();
