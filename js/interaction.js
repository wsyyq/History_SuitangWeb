/* Offline SVG whiteboard. Content and ink share ONE logical, un-reflowing stage.
 * Stored points are inverse-transformed stage units, never screen/device pixels.
 * Only page-session memory is used; no storage, network or production dependencies.
 */
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg', WIDTH=1200;
  const memory=new Map(), main=document.querySelector('#main-content');
  const toolbar=document.querySelector('#interaction-toolbar');
  const modeNames={select:'点选',draw:'绘画',move:'移动',zoom:'放大'};
  const colors=[['朱砂','#c52f25'],['青黛','#146f9b'],['浓墨','#202020'],['金黄','#a66b00']];
  let mode='select',tool='pen',color=colors[0][1],width=4,active=null,gesture=null,serial=0;
  let notice='',ignoreClickUntil=0;
  const button=(text,attrs)=>`<button type="button" class="tool-button" ${attrs}>${text}</button>`;
  toolbar.innerHTML=`<div class="tool-row"><div class="tool-group" role="group" aria-label="主操作模式">${Object.entries(modeNames).map(([id,name])=>button(name,`data-mode="${id}" aria-pressed="false"`)).join('')}</div><div class="tool-group" role="group" aria-label="绘画子工具">${button('画笔','data-tool="pen" aria-pressed="false"')}${button('橡皮','data-tool="eraser" aria-pressed="false"')}</div><div class="tool-group" role="group" aria-label="笔迹颜色">${colors.map(([name,value])=>`<button type="button" class="tool-button color-button" style="--swatch:${value}" data-color="${value}" aria-pressed="false" title="${name}">${name}</button>`).join('')}<label>笔粗<select id="pen-width" aria-label="画笔粗细"><option value="2">细 2</option><option value="4" selected>中 4</option><option value="8">粗 8</option></select></label></div><div class="tool-group">${button('撤销','data-action="undo" title="撤销本页操作（Ctrl/Cmd+Z）"')}${button('清空本页','data-action="clear"')}</div></div><div class="tool-row"><div class="tool-group">${button('－','data-action="minus" aria-label="缩小"')}<output id="zoom-label">1.0×</output>${button('＋','data-action="plus" aria-label="放大一级"')}${button('适应屏幕','data-action="reset"')}</div><span id="tool-status" role="status" aria-live="polite"></span><span id="session-note">本页板书 · 切页保留，刷新清除</span></div>`;

  function keyFor(page){return page.boardKey||(page.level===4?`flow/${page.flow}`:page.module==='review'?'review':page.id);}
  function entry(key){if(!memory.has(key))memory.set(key,{strokes:[],history:[]});return memory.get(key);}
  function current(){return active?entry(active.key):null;}
  function update(){
    toolbar.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
    toolbar.querySelectorAll('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(mode==='draw'&&b.dataset.tool===tool)));
    toolbar.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===color)));
    toolbar.querySelector('[data-action="undo"]').disabled=!current()?.history.length;
    toolbar.querySelector('[data-action="clear"]').disabled=!current()?.strokes.length;
    toolbar.querySelector('[data-action="minus"]').disabled=!active||active.zoom<=1;
    toolbar.querySelector('[data-action="plus"]').disabled=!active||active.zoom>=4;
    toolbar.querySelector('#zoom-label').value=`${(active?.zoom||1).toFixed(1)}×`;
    const help={select:'点选：点击热点进入下级；滚轮阅读',draw:tool==='pen'?'绘画 / 画笔：内容区落笔，不跳页':'绘画 / 橡皮：碰到即擦除整条笔迹',move:'移动：拖动内容与板书；滚轮阅读',zoom:'放大：点击关注位置放大；滚轮仅阅读'};
    toolbar.querySelector('#tool-status').textContent=notice||help[mode];
    if(active)active.viewport.dataset.mode=mode;
    if(window.LESSON)window.LESSON.interactionMode=mode;
  }
  function setMode(next){finish(true);mode=next;notice='';update();}
  function svgElement(tag,attributes){const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attributes))el.setAttribute(k,v);return el;}
  function mark(stroke){
    const pts=stroke.points;
    if(pts.length===1)return svgElement('circle',{cx:pts[0].x,cy:pts[0].y,r:stroke.width/2,fill:stroke.color,'data-stroke-id':stroke.id});
    return svgElement('polyline',{points:pts.map(p=>`${p.x},${p.y}`).join(' '),fill:'none',stroke:stroke.color,'stroke-width':stroke.width,'stroke-linecap':'round','stroke-linejoin':'round','data-stroke-id':stroke.id});
  }
  function redraw(){if(!active)return;active.svg.replaceChildren(...current().strokes.map(mark));if(gesture?.stroke)active.svg.append(mark(gesture.stroke));}
  function constrain(){
    const a=active,s=a.base*a.zoom,vw=a.viewport.clientWidth,vh=a.viewport.clientHeight;
    const bound=(p,size,view)=>size<=view?(view-size)/2:Math.min(0,Math.max(view-size,p));
    a.x=bound(a.x,WIDTH*s,vw);a.y=bound(a.y,a.height*s,vh);
  }
  function transform(){if(!active)return;constrain();active.stage.style.transform=`translate(${active.x}px,${active.y}px) scale(${active.base*active.zoom})`;update();}
  function fit(){if(!active)return;finish(true);active.zoom=1;active.x=0;active.y=0;notice='视图已复位；本页笔迹保留';transform();}
  function zoomTo(value,clientX,clientY){
    if(!active?.ready)return;finish(true);const a=active,box=a.viewport.getBoundingClientRect();
    const px=clientX===undefined?a.viewport.clientWidth/2:clientX-box.left;
    const py=clientY===undefined?a.viewport.clientHeight/2:clientY-box.top;
    const next=Math.max(1,Math.min(4,Math.round(value*2)/2)),ratio=next/a.zoom;
    a.x=px-(px-a.x)*ratio;a.y=py-(py-a.y)*ratio;a.zoom=next;notice='';transform();
  }
  function point(event){
    const r=active.stage.getBoundingClientRect(),s=active.base*active.zoom;
    return {x:(event.clientX-r.left)/s,y:(event.clientY-r.top)/s};
  }
  function inStage(p){return p.x>=0&&p.y>=0&&p.x<=WIDTH&&p.y<=active.height;}
  function distance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;const t=l?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)):0;return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
  function intersects(a,b,c,d,r){
    // Segment intersection + endpoint distances: fast eraser movements cannot skip ink.
    const cross=(p,q,t)=>(q.x-p.x)*(t.y-p.y)-(q.y-p.y)*(t.x-p.x);
    if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)return true;
    return Math.min(distance(a,c,d),distance(b,c,d),distance(c,a,b),distance(d,a,b))<=r;
  }
  function erase(p){
    const last=gesture.last||p,radius=12/(active.base*active.zoom);
    current().strokes=current().strokes.filter(stroke=>{
      const points=stroke.points,r=radius+stroke.width/2;
      const hit=points.length===1?distance(points[0],last,p)<=r:points.slice(1).some((q,i)=>intersects(last,p,points[i],q,r));
      return !hit;
    });gesture.last=p;redraw();
  }
  function finish(cancel=false){
    if(!gesture)return;const g=gesture;gesture=null;
    if(active){
      const data=current();
      if(g.kind==='pen'&&!cancel){data.history.push(g.before);data.strokes=[...data.strokes,g.stroke];}
      if(g.kind==='eraser'){if(cancel)data.strokes=g.before;else if(data.strokes.length!==g.before.length)data.history.push(g.before);}
      active.viewport.dataset.active='false';
      try{if(active.viewport.hasPointerCapture(g.pointerId))active.viewport.releasePointerCapture(g.pointerId);}catch{}
      redraw();update();
    }
  }
  function start(e){
    if(!active?.ready||gesture||!e.isPrimary||e.button>0)return;
    if(mode==='select')return;
    e.preventDefault();const p=point(e);if(!inStage(p))return;
    if(mode==='zoom'){zoomTo(active.zoom+.5,e.clientX,e.clientY);return;}
    const before=current().strokes.slice();
    gesture={pointerId:e.pointerId,kind:mode==='move'?'move':tool,before,start:{x:e.clientX,y:e.clientY},pan:{x:active.x,y:active.y}};
    if(gesture.kind==='pen')gesture.stroke={id:++serial,pageId:active.key,color,width,points:[p]};
    if(gesture.kind==='eraser')erase(p);
    active.viewport.dataset.active='true';try{active.viewport.setPointerCapture(e.pointerId);}catch{}
    redraw();
  }
  function move(e){
    if(!gesture||gesture.pointerId!==e.pointerId)return;e.preventDefault();
    if(gesture.kind==='move'){
      active.x=gesture.pan.x+e.clientX-gesture.start.x;active.y=gesture.pan.y+e.clientY-gesture.start.y;
      notice=active.zoom===1&&active.height*active.base<=active.viewport.clientHeight?'当前内容已适应屏幕；请先放大再移动':'';transform();return;
    }
    const events=e.getCoalescedEvents?.();
    for(const sample of events?.length?events:[e]){
      const p=point(sample);if(!inStage(p)){finish(false);return;}
      if(gesture.kind==='pen'){
        const pts=gesture.stroke.points,last=pts[pts.length-1];if(Math.hypot(last.x-p.x,last.y-p.y)>.25)pts.push(p);
      }else erase(p);
    }redraw();
  }
  function undo(){finish(true);const data=current();if(data?.history.length){data.strokes=data.history.pop();notice='已撤销本页最近一次操作';redraw();update();}}
  function clear(){finish(true);const data=current();if(data?.strokes.length&&window.confirm('清空本页全部标注？其他页面不受影响，清空后可撤销恢复。')){data.history.push(data.strokes);data.strokes=[];notice='本页已清空，可点击撤销恢复';redraw();update();}}
  toolbar.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.mode)setMode(b.dataset.mode);
    else if(b.dataset.tool){tool=b.dataset.tool;setMode('draw');}
    else if(b.dataset.color){finish(true);color=b.dataset.color;notice='笔色仅影响新笔迹';update();}
    else ({undo,clear,minus:()=>zoomTo(active.zoom-.5),plus:()=>zoomTo(active.zoom+.5),reset:fit})[b.dataset.action]?.();
  });
  toolbar.querySelector('#pen-width').addEventListener('change',e=>{finish(true);width=Number(e.target.value);notice='笔粗仅影响新笔迹';update();});
  function unmount(){finish(true);active?.abort.abort();active=null;}
  function measure(reset=true){
    if(!active)return;const a=active;a.height=Math.max(540,a.content.scrollHeight);
    a.svg.setAttribute('viewBox',`0 0 ${WIDTH} ${a.height}`);a.svg.setAttribute('width',WIDTH);a.svg.setAttribute('height',a.height);a.stage.style.height=a.height+'px';
    // Long teaching answers, like textbooks, keep readable type and use shared-stage scrolling.
    a.base=a.page.level===3||a.page.readableFlow?a.viewport.clientWidth/WIDTH:Math.min(a.viewport.clientWidth/WIDTH,a.viewport.clientHeight/a.height);
    if(reset){a.zoom=1;a.x=0;a.y=0;}transform();
  }
  async function mount(page){
    unmount();mode='select';notice='';const viewport=document.createElement('div');viewport.className='board-viewport';viewport.id='board-viewport';viewport.tabIndex=0;viewport.setAttribute('aria-label','课堂内容区，点选或使用白板工具；滚轮上下阅读');
    const stage=document.createElement('div');stage.className='board-stage';stage.id='board-stage';
    const content=document.createElement('div');content.className='board-content';content.append(...main.childNodes);content.querySelector('#annotation-layer')?.remove();
    const svg=svgElement('svg',{class:'board-ink',id:'annotation-layer','aria-label':'本页手写标注'});
    stage.append(content,svg);viewport.append(stage);main.append(viewport);
    const a={page,key:keyFor(page),viewport,stage,content,svg,base:1,zoom:1,x:0,y:0,height:540,ready:false,abort:new AbortController()};active=a;
    const options={signal:a.abort.signal};
    viewport.addEventListener('pointerdown',start,options);viewport.addEventListener('pointermove',move,options);
    viewport.addEventListener('pointerup',e=>{if(gesture?.pointerId===e.pointerId)finish(false);},options);
    viewport.addEventListener('pointercancel',()=>finish(true),options);viewport.addEventListener('lostpointercapture',()=>finish(true),options);
    viewport.addEventListener('click',e=>{if(mode!=='select'||performance.now()<ignoreClickUntil){e.preventDefault();e.stopImmediatePropagation();}}, {...options,capture:true});
    viewport.addEventListener('wheel',e=>{if(e.ctrlKey||!a.ready)return;e.preventDefault();if(mode==='draw'||gesture)return;a.y-=e.deltaY*(e.deltaMode===1?16:1);a.x-=e.deltaX*(e.deltaMode===1?16:1);notice='';transform();},{...options,passive:false});
    // A single-finger pan in select mode preserves tap-to-navigate, without native
    // scrolling competing with the shared transform. Synthetic touch is tested;
    // real stylus/touch hardware remains an explicit manual acceptance item.
    let touch=null;
    viewport.addEventListener('pointerdown',e=>{if(mode==='select'&&e.pointerType==='touch'&&e.isPrimary)touch={id:e.pointerId,x:e.clientX,y:e.clientY,panX:a.x,panY:a.y,moved:false};},options);
    viewport.addEventListener('pointermove',e=>{if(mode!=='select'||!touch||touch.id!==e.pointerId)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;if(Math.hypot(dx,dy)>8){touch.moved=true;a.x=touch.panX+dx;a.y=touch.panY+dy;transform();}},options);
    viewport.addEventListener('pointerup',()=>{if(touch?.moved)ignoreClickUntil=performance.now()+400;touch=null;},options);
    viewport.addEventListener('pointercancel',()=>{touch=null;},options);
    update();
    await Promise.all([...content.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));
    if(active!==a)return;measure();redraw();a.ready=true;viewport.dataset.ready='true';update();
  }
  let resizeFrame;
  window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{finish(true);measure();});});
  window.addEventListener('blur',()=>finish(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)finish(true);});
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key.toLowerCase()==='z'&&!e.target.closest('input,textarea,select,[contenteditable="true"]')&&mode==='draw'){e.preventDefault();undo();}
  });
  window.addEventListener('lesson:before-navigate',unmount);
  window.addEventListener('lesson:navigate',e=>mount(e.detail));
  // Read-only diagnostic snapshots allow tests to inspect geometry and isolation.
  window.LessonBoard={snapshot:()=>active?JSON.parse(JSON.stringify({key:active.key,pageId:active.page.id,mode,tool,color,width,zoom:active.zoom,base:active.base,x:active.x,y:active.y,height:active.height,ready:active.ready,strokes:current().strokes,undoCount:current().history.length})):null};
  update();
})();
