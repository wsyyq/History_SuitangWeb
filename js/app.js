(() => {
  'use strict';
  const {modules,sections,flows,reviews}=window.LESSON;
  const assets=window.TEXTBOOK_ASSETS, main=document.querySelector('main');
  const top=['title','standard','outline'];
  const moduleById=Object.fromEntries(modules.map(m=>[m.id,m]));
  const pages=Object.fromEntries(Object.values(sections).flatMap(s=>s.assets.map((asset,i)=>{
    const id=`${s.id}--${asset}`;return [id,{id,asset,section:s.id,module:s.module,index:i}];
  })));
  let current,nav={},question={index:0,revealed:false},lastAdvance=-Infinity;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const link=(id,label,cls='nav-button')=>`<a class="${cls}" href="#${esc(id)}">${esc(label)}</a>`;
  const first=s=>`${s}--${sections[s].assets[0]}`;
  const flowRoute=(f,p)=>`flow/${f}/${p}`;
  // FIX01 bookmarks migrate inside the original subtopic. Source artwork remains archived.
  const migrations={
    'sui-prosper--granary':'sui-prosper--sui-prosper','sui-end--yangdi':'sui-end--sui-poem',
    'tang-relations--jiaohe':'tang-relations--huihe','tang-relations--tribute':'tang-relations--tubo',
    'tang-relations--alliance':'tang-relations--frontier','tang-relations--ethnic-policy':'tang-relations--map-669',
    'an-impact--an-process':'an-impact--an-impact','an-impact--army-source':'an-impact--fanzhen',
    'tang-end--five':'tang-end--huangchao','five--chairong':'five--five'
  };
  function migrate(hash){
    const id=hash.replace(/^#/,'');if(migrations[id])return migrations[id];
    const [kind,flow,origin]=id.split('/');
    if(kind==='flow'&&['goguryeo','sui-burden'].includes(flow)){
      const source=migrations[origin]||origin;
      return pages[source]?source:'sui-end--sui-end';
    }
    if(kind==='flow'&&flow==='map-reading')return 'tang-relations--map-669';
    if(kind==='flow'&&flows[flow]&&migrations[origin])return flowRoute(flow,migrations[origin]);
    return id;
  }
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
  const cumulative=i=>modules.slice(0,i+1).reduce((n,m)=>n+m.targetMinutes,0);
  const nextModule=s=>modules[modules.findIndex(m=>m.id===s.module)+1];
  function moduleCards(){return `<div class="module-grid">${modules.map((m,i)=>`<a class="module-card" href="#${m.id}"><span class="number">0${i+1} / ${m.eyebrow}</span><span class="arrow" aria-hidden="true">↗</span><h2>${m.title}</h2><p>${m.description}</p><small class="module-time">参考 ${m.targetMinutes} 分钟 · 累计 ${cumulative(i)} 分钟</small></a>`).join('')}</div>`;}
  const items=()=>flows[current.flow]?.items||[];
  // Classroom presentation excludes audit metadata; evidence states remain in data.
  function contentBlocks(blocks,cls='content-blocks'){
    return `<div class="${cls}">${blocks.filter(b=>b.presentationOnly!==false).map(b=>`<section class="content-block"><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></section>`).join('')}</div>`;
  }
  function teachingNote(id){
    const note=window.LESSON.teachingNotes?.[id];if(!note)return '';
    const caption=note.presentationNote??note.note;
    return `<aside class="teaching-note" aria-label="教材后的讲解要点"><h2>${esc(note.title)}</h2>${contentBlocks(note.blocks)}${sequence(note.sequence)}${caption?`<p class="note-boundary">${esc(caption)}</p>`:''}</aside>`;
  }
  function sequence(data){
    return data?`<figure class="history-sequence"><figcaption>${esc(data.title)}</figcaption><ol>${data.nodes.map(b=>`<li><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></li>`).join('')}</ol></figure>`:'';
  }
  let mapSelection=null;
  function mountMap(s){
    const config=window.LESSON.map669,host=main.querySelector('#textbook-viewport'),figure=main.querySelector('#textbook-surface');
    figure.classList.add('location-map');
    figure.insertAdjacentHTML('beforeend',`<svg class="map-locations" viewBox="0 0 ${config.width} ${config.height}" aria-hidden="true">${config.objects.map(o=>`<g data-map-mark="${o.id}" visibility="${mapSelection===o.id?'visible':'hidden'}">${o.boxes.map(b=>`<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="9"/>`).join('')}</g>`).join('')}</svg>`);
    host.insertAdjacentHTML('afterbegin',`<section class="map-guide" aria-label="669年地图定位"><div class="map-options" role="group" aria-label="选择定位对象">${config.objects.map(o=>`<button type="button" data-map-object="${o.id}" aria-pressed="${mapSelection===o.id}">${esc(o.name)}</button>`).join('')}<button type="button" data-map-object="">清除定位</button></div><div class="map-panels" aria-live="polite"><p class="map-panel" data-map-panel="" ${mapSelection?'hidden':''}>先选择对象，再向下读图。朱砂框只定位文字，不代表疆域。可使用白板放大、移动；图题、图例与全部年代注记均保留。</p>${config.objects.map(o=>`<p class="map-panel" data-map-panel="${o.id}" ${mapSelection===o.id?'':'hidden'}><strong>${esc(o.name)} · ${esc(o.position)}</strong><br>${esc(o.text)}</p>`).join('')}</div><p class="map-source">${esc(config.sourceRef)} · 定位示意，非政治边界</p>${link(flowRoute('relations',s.id),'交往方式问答 ↗','nav-button map-question')}</section>`);
    host.querySelector('.map-guide').addEventListener('click',e=>{
      const b=e.target.closest('[data-map-object]');if(!b||window.LESSON.interactionMode!=='select')return;
      mapSelection=b.dataset.mapObject||null;
      host.querySelectorAll('[data-map-object]').forEach(el=>el.setAttribute('aria-pressed',String(!!mapSelection&&el.dataset.mapObject===mapSelection)));
      host.querySelectorAll('[data-map-panel]').forEach(el=>el.hidden=(el.dataset.mapPanel||null)!==mapSelection);
      figure.querySelectorAll('[data-map-mark]').forEach(el=>el.setAttribute('visibility',el.dataset.mapMark===mapSelection?'visible':'hidden'));
    });
  }
  function answerContent(q){
    if(q.presentation==='four-stages')return fourStages(q.timeline);
    if(q.answerSections)return `<div class="answer-sections ${esc(q.presentation)}">${q.answerSections.map(b=>`<section><h3>${esc(b.title)}</h3>${b.items.length===1?`<p>${esc(b.items[0])}</p>`:`<ol>${b.items.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`}</section>`).join('')}</div>`;
    if(q.compact)return `<p class="core-answer">${esc(q.answer)}</p>${q.image?`<figure class="teacher-map"><img src="${esc(q.image.path)}" width="${q.image.width}" height="${q.image.height}" alt="${esc(q.image.alt)}"></figure>`:''}`;
    const core=q.answerBlocks?contentBlocks(q.answerBlocks):`<p class="core-answer">${esc(q.answer||'')}</p>`;
    const diagram=q.diagram?`<figure class="concept-model"><figcaption>${esc(q.diagram.title)}</figcaption><ol>${q.diagram.nodes.map(n=>`<li>${esc(n)}</li>`).join('')}</ol></figure>`:'';
    return `${core}${diagram}${sequence(q.sequence)}${q.explanation?`<p class="answer-explanation">${esc(q.explanation)}</p>`:''}`;
  }
  function fourStages(rows){return `<dl class="four-stages">${rows.map(r=>`<div><dt>${esc(r.title)}</dt><dd>${esc(r.text)}</dd></div>`).join('')}</dl>`;}
  function questionLabel(){return items().length?`第 ${question.index+1}/${items().length} 题 · ${question.revealed?'答案栏已揭示':'答案待揭示'}`:'课堂问题';}
  function renderProgress(s){
    const i=modules.findIndex(m=>m.id===s.module),m=modules[i];
    const detail=s.level===4?`${sections[s.section].title} · ${questionLabel()}`:s.level===3?`${sections[s.section].title} · 片段 ${s.index+1}/${sections[s.section].assets.length}`:s.module==='review'?`回顾 ${(s.reviewIndex??0)+1}/${reviews.length} · 题目与答案栏同时展示`:m?'模块目录 · 可自由选择教学路线':'课程准备 · 选择模块开始授课';
    document.querySelector('#lesson-progress').innerHTML=`<strong>${m?`${esc(m.title)} · ${i+1}/${modules.length}`:`${window.LESSON.totalMinutes}分钟课堂`}</strong><span>${esc(detail)}</span><span class="reference-time">${m?`本模块参考 ${m.targetMinutes} 分钟<br>累计参考 ${cumulative(i)} / ${window.LESSON.totalMinutes} 分钟`:`整课参考 ${window.LESSON.totalMinutes} 分钟 · 非实际计时`}</span>`;
  }
  function renderQuestion(s){
    const f=flows[s.flow],q=items()[question.index];
    // The first question retains the former group board key; later questions are isolated.
    s.boardKey=question.index===0?`flow/${s.flow}`:`flow/${s.flow}/question/${q.questionId}`;
    s.questionId=q?.questionId||null;
    s.readableFlow=!!q;
    return `<div class="teaching-flow">`+head('课堂问题 / 第四级',esc(f.title))+`<section class="flow-box qa-card"><h2 id="question-prompt">${esc(q?.prompt||'课堂问题')}</h2>${q?`<div class="qa-answer" id="qa-answer" hidden aria-hidden="true" inert>${answerContent(q)}</div>`:'<p class="empty-group">请返回教材，继续其他教学内容。</p>'}</section></div>`;
  }
  function advanceQuestion(event,previous=false){
    if(current.level!==4||event?.repeat||event?.detail>1)return;
    const now=performance.now();if(now-lastAdvance<250)return;
    const list=items();if(!list.length||previous&&question.index===0)return;
    lastAdvance=now;
    if(previous){question.index--;question.revealed=false;render(false);return;}
    if(!question.revealed){
      question.revealed=true;
      const answer=document.querySelector('#qa-answer');answer.hidden=false;answer.setAttribute('aria-hidden','false');answer.inert=false;
      // Only visibility changes; stage geometry, transform and ink remain untouched.
      renderNavigation(current);renderProgress(current);
      document.querySelector('[data-qa-action="continue"]').focus({preventScroll:true});return;
    }
    if(question.index+1<list.length){question.index++;question.revealed=false;render(false);}
    else location.hash=current.origin;
  }
  function configureNav(s){
    nav={};let siblings=[];
    if(s.level===1){siblings=top;nav.up=s.id==='title'?null:'title';}
    else if(s.level===2){siblings=modules.map(m=>m.id);nav.up='outline';if(s.module==='review'){siblings=reviews.map((_,i)=>`review/${i}`);nav.prev=s.reviewIndex>0?`review/${s.reviewIndex-1}`:null;nav.next=(s.reviewIndex??0)<3?`review/${(s.reviewIndex??0)+1}`:null;return;}const m=moduleById[s.module];nav.down=m.sections.length?first(m.sections[0]):null;}
    else if(s.level===3){siblings=moduleById[s.module].sections.flatMap(id=>sections[id].assets.map(a=>`${id}--${a}`));nav.up=s.module;nav.down=sections[s.section].flows.length?flowRoute(sections[s.section].flows[0],s.id):null;}
    else {nav.up=s.origin;return;}
    const index=siblings.indexOf(s.id);nav.prev=siblings[index-1]||null;nav.next=siblings[index+1]||null;
    if(s.level===1&&s.id==='outline')nav.down='standards';
  }
  function renderNavigation(s){
    const control=(id,label,why)=>id?link(id,label):`<button class="nav-button" disabled title="${why}">${label}</button>`;
    let nextLabel='下一页 →';
    if(s.level===2&&s.module!=='review'&&nav.next)nextLabel=`下一模块：${moduleById[nav.next].title} →`;
    if(s.level===3&&nav.next)nextLabel=pages[nav.next].section===s.section?'下一片段 →':'下一子目 →';
    const next=nextModule(s);
    document.querySelector('#navigation').innerHTML=s.level===4?
      link(s.origin,'返回原教材页')+`<button class="nav-button" data-qa-action="previous" ${question.index===0?'disabled':''}>← 上一题</button>`+(items().length?`<button class="primary" data-qa-action="continue">${!question.revealed?'揭示答案':question.index+1<items().length?'下一题 →':'完成并返回教材'}</button>`:''):
      control(nav.up,s.level===3?'返回本模块菜单':'返回上一级', '当前已是首页')+control(nav.prev,'← 上一页','已是本级第一页')+control(nav.next,nextLabel,'已是本级末页')+(s.level===3&&!nav.next&&next?link(next.id,`下一模块：${next.title} →`,'primary'):'')+(s.module==='review'&&(s.reviewIndex??0)===reviews.length-1?link('outline','结束回顾 · 返回课堂脉络','primary'):'')+(nav.down?link(nav.down,s.level===3?'进入问题链':'进入下一级','primary'):'');
    document.querySelectorAll('#navigation .nav-button').forEach((b,i)=>{const label=b.textContent;b.setAttribute('aria-label',label);b.title=label;b.innerHTML=`<span aria-hidden="true">${i===0?'↩':i===1?'←':'→'}</span>`;});
    document.querySelectorAll('#navigation .primary').forEach(b=>{
      const label=b.textContent;b.setAttribute('aria-label',label);b.title=label;
      const short=label==='揭示答案'?'揭示答案':label.startsWith('下一题')?'下一题':label.startsWith('完成')?'完成返回':label.startsWith('进入问题')?'进入问题':label.startsWith('进入')?'进入下级':label.startsWith('下一模块')?'下一模块':'结束回顾';
      b.innerHTML=`<span aria-hidden="true">${short}</span>`;
    });
    const crumbs=[link('title','首页','crumb')];
    if(s.id!=='title')crumbs.push(link('outline','课堂脉络','crumb'));
    if(s.module)crumbs.push(link(s.module,moduleById[s.module].title,'crumb'));
    if(s.section)crumbs.push(link(first(s.section),sections[s.section].title,'crumb'));
    if(s.level===4)crumbs.push('<span>课堂问题</span>');
    else if(s.id==='standard')crumbs.push('<span>课标要求</span>');
    document.querySelector('#breadcrumbs').innerHTML=crumbs.join('<span aria-hidden="true">/</span>');
  }
  function render(resetQuestion=true){
    const migrated=migrate(location.hash);
    if(migrated!==location.hash.replace(/^#/,'')){location.replace('#'+migrated);return;}
    const incoming=parse(location.hash);
    if(!incoming){location.replace('#title');return;}
    window.dispatchEvent(new Event('lesson:before-navigate'));
    current=incoming;if(resetQuestion)question={index:0,revealed:false};configureNav(current);const s=current;
    document.body.dataset.level=String(s.level);document.body.dataset.pageId=s.id;
    if(s.id==='title'){
      main.innerHTML=`<section class="hero"><div><div class="eyebrow">高中历史 · 第六课</div><h1>从隋唐盛世<span>到五代十国</span></h1><p>循着统一、繁荣与分合的脉络，<br>走进隋唐历史。</p>${link('standard','开始授课　→','primary')}<div class="course-meta" style="margin-top:40px">中外历史纲要 · 上　/　${window.LESSON.totalMinutes} 分钟课堂</div></div><figure class="hero-art"><img src="${assets['canal-photo'].path}" alt="教材插图：大运河今貌"><figcaption>大运河今貌 · 教材原图<br>PDF 第 1/6 页｜教材第 34 页</figcaption></figure></section>`;
    }else if(s.id==='standard'||s.module==='standards'){
      main.innerHTML=head(s.level===1?'课程导入 / 02':'模块 01 / 课标研读','课标要求')+renderStandards();
    }else if(s.id==='outline'){
      main.innerHTML=head('课程导入 / 03','课堂脉络','选择一个模块，开始阅读与思考。')+moduleCards();
    }else if(s.module==='review'){
      s.readableFlow=true;
      main.innerHTML=head('模块 06 / 二级内容','内容回顾','四项题答直接展示 · 向下滚动阅读')+`<div class="review-grid review-complete">${window.LESSON.reviewItems.map((q,i)=>`<article id="review-card-${i}" class="review-card ${i===(s.reviewIndex??0)?'active':''}"><a href="#review/${i}" aria-label="选择回顾${i+1}：${esc(q.prompt)}"><span class="badge">回顾 0${i+1}</span><h2>${esc(q.prompt)}</h2></a><div class="review-answer">${q.presentation==='four-stages'?fourStages(q.timeline):esc(q.answer)}</div></article>`).join('')}</div>`;
    }else if(s.level===2){
      const m=moduleById[s.module];main.innerHTML=head(`模块 0${modules.indexOf(m)+1} / ${m.eyebrow}`,m.title,m.description)+`<div class="section-menu">${m.sections.map((id,i)=>`<a class="section-link" href="#${first(id)}"><span>0${i+1}</span><strong>${sections[id].title}</strong><small>${sections[id].assets.length} 个教材片段</small><span aria-hidden="true">→</span></a>`).join('')}</div>`;
    }else if(s.level===3){
      const section=sections[s.section],asset=assets[s.asset];
      main.innerHTML=`<section class="reader-page">${head('教材研读 / 第三级',`${section.title}<small>${asset.title}</small>`)}<div class="reader-controls"><label for="fragment">教材片段</label><select id="fragment" aria-label="选择教材片段">${section.assets.map((a,i)=>`<option value="${section.id}--${a}" ${a===s.asset?'selected':''}>${i+1}/${section.assets.length} · ${assets[a].title}</option>`).join('')}</select><span class="source-label">PDF 第 ${asset.pdfPage}/6 页｜教材第 ${asset.printedPage} 页 · 滚轮阅读 · 白板可缩放移动</span></div><div class="reader-layout"><div id="textbook-viewport" tabindex="0" aria-label="教材阅读区，可上下滚动"><figure id="textbook-surface" data-asset-id="${asset.id}" style="--image-width:${asset.displayWidth}px"><img src="${asset.path}" alt="${asset.title}，教材第${asset.printedPage}页"><div id="annotation-layer" aria-hidden="true"></div></figure></div><div class="hotspots"><span class="label">${section.flows.length?'课堂问题 · 点选进入':'本段无四级问题入口'}　</span>${section.flows.map(f=>link(flowRoute(f,s.id),flows[f].title+' ↗','hotspot')).join('')}</div></div></section>`;
      main.querySelector('select').addEventListener('change',e=>{location.hash=e.target.value;});
      if(s.id==='tang-relations--frontier')main.querySelector('#textbook-viewport').insertAdjacentHTML('beforeend','<figure class="thinking-point"><img src="./assets/lesson/tang-thinking-point.png" width="530" height="217" alt="教材思考点：隋唐盛世形成的原因有哪些？"><figcaption>教材 PDF 第4/6页｜印刷第37页 · 保留思考点</figcaption></figure>');
      const note=teachingNote(s.id);if(note)main.querySelector('#textbook-viewport').insertAdjacentHTML('beforeend',note);
      if(s.asset==='map-669')mountMap(s);
      const img=main.querySelector('img');img.addEventListener('error',()=>{img.insertAdjacentHTML('afterend','<p class="image-error">教材图片加载失败，请检查本地素材文件是否完整。</p>');});

    }else if(s.level===4){
      main.innerHTML=renderQuestion(s);
    }
    renderNavigation(s);renderProgress(s);main.scrollTop=0;
    const heading=main.querySelector('h1');if(heading)heading.focus({preventScroll:true});
    document.title=`${s.level===4?flows[s.flow].title:s.level===3?sections[s.section].title:s.module?moduleById[s.module].title:'从隋唐盛世到五代十国'} · 历史课堂`;
    window.dispatchEvent(new CustomEvent('lesson:navigate',{detail:{...s,interactionMode:'select'}}));
  }
  window.addEventListener('hashchange',()=>render());
  document.querySelector('#navigation').addEventListener('click',e=>{const b=e.target.closest('[data-qa-action]');if(b&&!b.disabled)advanceQuestion(e,b.dataset.qaAction==='previous');});
  document.addEventListener('keydown',e=>{
    if(e.defaultPrevented)return;
    if(e.key===' '&&e.target.matches('.brand,.outline-link,#navigation a')){e.preventDefault();e.target.click();return;}
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(current.level===4&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();advanceQuestion(e,e.key==='ArrowLeft');return;}
    const target=e.key==='ArrowRight'?nav.next:e.key==='ArrowLeft'?nav.prev:e.key==='Escape'?nav.up:null;
    if(target){e.preventDefault();location.hash=target;}
  });
  // Whiteboard lifecycle is driven by before-navigate / navigate events.
  window.LessonApp={getState:()=>({...current,...(current.level===4?{questionIndex:question.index,revealed:question.revealed,questionCount:items().length}:{})}),getPages:()=>({...pages})};
  render();
})();
