/* Development-only acceptance. NODE_PATH supplies Playwright; no classroom dependency. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert'),http=require('http');
const {pathToFileURL}=require('url');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/fix01/whiteboard-regression');
const file=pathToFileURL(path.join(root,'index.html')).href;
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
 try{
 const context=await browser.newContext({offline:true,viewport:{width:1280,height:720}}),p=await context.newPage();
 const errors=[],network=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
 p.on('dialog',d=>d.accept());
 await p.goto(file);
 async function ready(id){await p.waitForFunction(id=>document.body.dataset.pageId===id&&LessonBoard.snapshot()?.ready,id);}
 async function go(id){await p.evaluate(id=>location.hash=id,id);await ready(id);}
 const snap=()=>p.evaluate(()=>LessonBoard.snapshot());
 const mode=m=>p.locator(`#interaction-toolbar [data-mode="${m}"]`).click();
 const action=a=>p.locator(`#interaction-toolbar [data-action="${a}"]`).click();
 const tool=t=>p.locator(`#interaction-toolbar [data-tool="${t}"]`).click();
 async function position(fx=.4,fy=.45){const b=await p.locator('#board-viewport').boundingBox();return {x:b.x+b.width*fx,y:b.y+b.height*fy};}
 async function line(at,dx=60,dy=15){await p.mouse.move(at.x,at.y);await p.mouse.down();await p.mouse.move(at.x+dx,at.y+dy,{steps:12});await p.mouse.up();}
 async function clean(){if((await snap()).strokes.length)await action('clear');}
 async function screenshot(name){await p.screenshot({path:path.join(out,name+'.png')});}
 await ready('title');await p.locator('#tool-panel-toggle').click();await p.waitForTimeout(80);
 const model=await p.evaluate(()=>({pages:LessonApp.getPages(),sections:LESSON.sections,modules:LESSON.modules,flows:LESSON.flows}));
 const pageIds=Object.keys(model.pages),flowRoutes=pageIds.flatMap(id=>model.sections[model.pages[id].section].flows.map(f=>`flow/${f}/${id}`));
 const routes=['title','standard','outline',...model.modules.map(m=>m.id),...pageIds,...flowRoutes,'review/0','review/1','review/2','review/3'];
 // Recheck ALL original routes at each required resolution. No stage 2 evidence overwritten.
 let layouts=0;
 for(const [width,height] of [[1920,1080],[1366,768],[1280,720]]){
  await p.setViewportSize({width,height});
  for(const id of routes){await go(id);const result=await p.evaluate(()=>({
   overflow:document.documentElement.scrollWidth>innerWidth,
   bad:[...document.querySelectorAll('header,footer,#interaction-toolbar button,#interaction-toolbar select,#navigation a,#navigation button')].filter(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth+.5||r.top<0||r.bottom>innerHeight+.5;}).map(e=>e.textContent),
   broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)
  }));assert.deepEqual(result,{overflow:false,bad:[],broken:[]},JSON.stringify({id,width,result}));layouts++;}
 }
 // Route 1: actual title controls, point/draw/undo/zoom/move/reset, then next.
 await go('title');await mode('draw');await line(await position(.25,.3));assert.equal((await snap()).strokes.length,1);await screenshot('01-title-ink');await action('undo');assert.equal((await snap()).strokes.length,0);
 await mode('zoom');let at=await position();await p.mouse.click(at.x,at.y);assert.equal((await snap()).zoom,1.5);await mode('move');const beforePan=await snap();await line(await position(.6,.55),-90,-30);assert.notDeepEqual([(await snap()).x,(await snap()).y],[beforePan.x,beforePan.y]);await action('reset');assert.equal((await snap()).zoom,1);await mode('select');await p.getByRole('link',{name:'开始授课　→',exact:true}).click();await ready('standard');assert.equal(await p.locator('.standards-image img').count(),1);
 await p.locator('#navigation').getByRole('link',{name:'下一页 →',exact:true}).click();await ready('outline');await p.locator('.module-card[href="#sui"]').click();await ready('sui');await p.locator('.section-link[href="#sui-prosper--sui-prosper"]').click();await ready('sui-prosper--sui-prosper');
 // Route 2: content-hotspot interaction is mutually exclusive; nav stays usable.
 const origin='sui-prosper--sui-prosper',canal='#flow/canal/'+origin;
 await mode('draw');const hotspot=await p.locator(`.hotspot[href="${canal}"]`).boundingBox();await line({x:hotspot.x+15,y:hotspot.y+15},30,3);assert.equal((await snap()).pageId,origin);assert.equal((await snap()).strokes.length,1);
 await mode('move');await line({x:hotspot.x+15,y:hotspot.y+15},-20,5);assert.equal((await snap()).pageId,origin);assert.equal((await snap()).strokes.length,1);
 await mode('zoom');await p.mouse.click(hotspot.x+25,hotspot.y+15);assert.equal((await snap()).pageId,origin);await action('reset');await mode('select');
 await p.locator(`.hotspot[href="${canal}"]`).click();await ready(canal.slice(1));await p.locator('#navigation').getByRole('link',{name:'返回原教材页',exact:true}).click();await ready(origin);assert.equal((await snap()).strokes.length,1);assert.equal((await snap()).mode,'select');assert.equal((await snap()).zoom,1);await screenshot('02-sui-return-ink');
 // All hotspots return to their exact originating fragment, including from transformed state.
 let roundTrips=0;
 for(const id of pageIds){await go(id);const hrefs=await p.locator('.hotspot').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
  for(const href of hrefs){await p.locator(`.hotspot[href="${href}"]`).click();await ready(href.slice(1));await mode('draw');await p.locator('#navigation').getByRole('link',{name:'返回原教材页',exact:true}).click();await ready(id);roundTrips++;}
 }
 // Route 3: mark a precise map landmark, test image-relative ink error through transforms/resize.
 await go('tang-relations--map-669');await clean();await mode('select');const mapView=await p.locator('#board-viewport').boundingBox(),mapImage=await p.locator('#textbook-surface img').boundingBox();await p.mouse.move(mapView.x+mapView.width*.9,mapView.y+mapView.height*.5);await p.mouse.wheel(0,mapImage.y-mapView.y-15);await p.waitForTimeout(100);
 const target=await p.locator('#textbook-surface img').evaluate(i=>{const r=i.getBoundingClientRect();return {x:r.left+r.width*.42,y:r.top+r.height*.18};});
 await mode('draw');await p.mouse.click(target.x,target.y);let marker=(await snap()).strokes.at(-1).id;
 async function alignment(id,fx,fy){return p.evaluate(({id,fx,fy})=>{const im=document.querySelector('#textbook-surface img').getBoundingClientRect(),dot=document.querySelector(`[data-stroke-id="${id}"]`).getBoundingClientRect();return Math.hypot(dot.x+dot.width/2-(im.x+im.width*fx),dot.y+dot.height/2-(im.y+im.height*fy));},{id,fx,fy});}
 const precision=[];precision.push(await alignment(marker,.42,.18));
 await mode('zoom');for(let n=0;n<4;n++){const d=await p.locator(`[data-stroke-id="${marker}"]`).boundingBox();await p.mouse.click(d.x+d.width/2,d.y+d.height/2);}assert.equal((await snap()).zoom,3);precision.push(await alignment(marker,.42,.18));
 await mode('move');await line(await position(.6,.5),-70,-35);precision.push(await alignment(marker,.42,.18));
 await p.locator('[data-color="#146f9b"]').click();await tool('pen');await p.selectOption('#pen-width','8');at=await position(.5,.55);await p.mouse.click(at.x,at.y);const second=(await snap()).strokes.at(-1);assert.equal(second.color,'#146f9b');assert.equal(second.width,8);
 const rel=await p.locator('#textbook-surface img').evaluate((i,at)=>{const r=i.getBoundingClientRect();return {x:(at.x-r.x)/r.width,y:(at.y-r.y)/r.height};},at);
 await screenshot('03-map-three-times');await action('minus');precision.push(await alignment(marker,.42,.18));await action('reset');precision.push(await alignment(second.id,rel.x,rel.y));
 for(const size of [{width:1920,height:1080},{width:1366,height:768},{width:1280,height:720}]){await p.setViewportSize(size);await p.waitForTimeout(80);precision.push(await alignment(marker,.42,.18));precision.push(await alignment(second.id,rel.x,rel.y));await screenshot(`map-alignment-${size.width}`);}
 assert(Math.max(...precision)<1,JSON.stringify(precision));
 // Zoom bounds, extreme pan, transformed hotspot (DOM geometry follows common stage).
 while((await snap()).zoom<4)await action('plus');
 assert.equal((await snap()).zoom,4);assert(await p.locator('[data-action="plus"]').isDisabled());await mode('move');await line(await position(),2000,1500);await action('reset');assert.equal((await snap()).zoom,1);assert(await p.locator('[data-action="minus"]').isDisabled());
 await mode('zoom');const firstHot=await p.locator('.hotspot').first().boundingBox();await p.mouse.click(firstHot.x+20,firstHot.y+15);await mode('select');await p.locator('.hotspot').first().click();await ready('flow/relations/tang-relations--map-669');await p.locator('#navigation a').first().click();await ready('tang-relations--map-669');assert.equal((await snap()).strokes.length,2);
 // Route 4: color/width immutability, eraser undo, clear undo and per-logical-page isolation.
 await go('sui-end--sui-poem');await clean();await tool('pen');await p.locator('[data-color="#c52f25"]').click();await p.selectOption('#pen-width','2');const a=await position(.3,.6);await line(a);
 await p.locator('[data-color="#146f9b"]').click();await p.selectOption('#pen-width','8');const b=await position(.65,.7);await line(b);let state=await snap();assert.deepEqual(state.strokes.map(s=>[s.color,s.width]),[['#c52f25',2],['#146f9b',8]]);
 await tool('eraser');await p.mouse.click(a.x+25,a.y+6);assert.equal((await snap()).strokes.length,1);await action('undo');assert.equal((await snap()).strokes.length,2);await screenshot('04-eraser-undo');
 await go('tang-prosper--sancai');assert.equal((await snap()).strokes.length,0);await tool('pen');await line(await position());await go('sui-end--sui-poem');assert.equal((await snap()).strokes.length,2);await action('clear');assert.equal((await snap()).strokes.length,0);await action('undo');assert.equal((await snap()).strokes.length,2);await go('tang-prosper--sancai');assert.equal((await snap()).strokes.length,1);
 // Same image reused by two route IDs must not share ink.
 await go('an-process--an-process');await tool('pen');await line(await position());await go('an-impact--an-impact');assert.equal((await snap()).strokes.length,0);
 // Ten leave/return cycles: exactly one new stroke per pointer gesture.
 await go('sui-found--sui-found');const initial=(await snap()).strokes.length;
 for(let i=0;i<12;i++){await tool('pen');await line(await position(.25+i*.01,.55));await go('sui');await go('sui-found--sui-found');assert.equal((await snap()).strokes.length,initial+i+1);}
 await tool('pen');for(let i=0;i<12;i++)await line(await position(.4,.5));for(let i=0;i<24;i++)await action('undo');assert.equal((await snap()).strokes.length,initial);
 // Pointer cancel/blur/navigation during a stroke discard only the unfinished action.
 at=await position();await p.mouse.move(at.x,at.y);await p.mouse.down();await p.mouse.move(at.x+30,at.y+10);await p.evaluate(()=>window.dispatchEvent(new Event('blur')));await p.mouse.up();assert.equal((await snap()).strokes.length,initial);
 // Synthetic pen/touch events test handler paths, not physical hardware claims.
 for(const pointerType of ['pen','touch']){
  await p.locator('#board-viewport').evaluate((v,type)=>{const r=v.getBoundingClientRect();for(const [name,x] of [['pointerdown',.35],['pointermove',.4],['pointerup',.4]])v.dispatchEvent(new PointerEvent(name,{bubbles:true,cancelable:true,pointerId:91,isPrimary:true,pointerType:type,button:0,buttons:name==='pointerup'?0:1,clientX:r.x+r.width*x,clientY:r.y+r.height*.5}));},pointerType);
 }assert.equal((await snap()).strokes.length,initial+2);
 await p.locator('#board-viewport').evaluate(v=>{const r=v.getBoundingClientRect();v.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:92,isPrimary:true,pointerType:'touch',clientX:r.x+100,clientY:r.y+100}));v.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:92,isPrimary:true,pointerType:'touch'}));});assert.equal((await snap()).strokes.length,initial+2);
 // Route 5: fourth-level page and direct second-level review both support all tools.
 for(const id of ['flow/canal/sui-prosper--sui-prosper','review','standards','tang']){
  await go(id);await tool('pen');await line(await position(.4,.45));const count=(await snap()).strokes.length;await mode('zoom');at=await position();await p.mouse.click(at.x,at.y);await mode('move');await line(at,-50,-20);assert.equal((await snap()).strokes.length,count);await action('reset');await mode('select');
  if(id==='review'){assert.equal(await p.locator('.review-card').count(),4);assert.equal(await p.locator('#textbook-surface').count(),0);await screenshot('05-review-ink');await go('review/2');assert.equal((await snap()).strokes.length,count);}
  if(id.startsWith('flow')){await screenshot('05-flow-ink');await go('flow/granaries/sui-prosper--sui-prosper');assert.equal((await snap()).strokes.length,0);}
 }
 // Refresh intentionally clears all in-memory notes, while offline tools still load.
 await p.reload();await ready('tang');await p.locator('#tool-panel-toggle').click();await p.waitForTimeout(80);assert.equal((await snap()).strokes.length,0);
 // A missing source image must not disable the independent board or navigation.
 await p.route('**/map-five.png',route=>route.abort());await go('five--map-five');await tool('pen');await line(await position());assert.equal((await snap()).strokes.length,1);await action('undo');assert.equal((await snap()).strokes.length,0);await p.locator('#navigation a').first().click();await ready('fall');await p.unroute('**/map-five.png');
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
 // DPR 2: SVG geometry stays in CSS/logical units and remains sharp.
 const hi=await browser.newContext({offline:true,deviceScaleFactor:2,viewport:{width:1366,height:768}}),hp=await hi.newPage();await hp.goto(file+'#five--map-five');await hp.waitForFunction(()=>LessonBoard.snapshot()?.ready);await hp.locator('#tool-panel-toggle').click();await hp.waitForTimeout(80);await hp.locator('[data-tool="pen"]').click();const hr=await hp.locator('#board-viewport').boundingBox();await hp.mouse.click(hr.x+hr.width*.4,hr.y+hr.height*.5);assert.equal(await hp.evaluate(()=>LessonBoard.snapshot().strokes.length),1);await hi.close();
 // Local project-subpath runtime check, not a deployment.
 const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(req.url.split('?')[0]);if(!pathname.startsWith('/History_SuitangWeb/')){res.writeHead(404);return res.end();}const target=path.resolve(root,pathname.slice('/History_SuitangWeb/'.length)||'index.html');if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png'})[path.extname(target)]||'text/plain');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{const online=await browser.newContext(),op=await online.newPage();await op.goto(`http://127.0.0.1:${server.address().port}/History_SuitangWeb/index.html#five--map-five`);await op.waitForFunction(()=>window.LessonBoard?.snapshot()?.ready);await op.locator('#tool-panel-toggle').click();await op.waitForTimeout(80);await op.locator('[data-tool="pen"]').click();const r=await op.locator('#board-viewport').boundingBox();await op.mouse.click(r.x+r.width*.4,r.y+r.height*.5);assert.equal(await op.evaluate(()=>LessonBoard.snapshot().strokes.length),1);await online.close();}finally{await new Promise(r=>server.close(r));}
 const report={status:'passed',browser:await browser.version(),offlineFile:true,routeCount:routes.length,layoutChecks:layouts,hotspotRoundTrips:roundTrips,alignmentErrorPixels:precision,maxAlignmentError:Math.max(...precision),resizeResolutions:['1920x1080','1366x768','1280x720'],repeatCycles:12,consecutiveUndos:24,mouse:'automated actual input passed',touchPen:'synthetic events only; physical hardware untested',dpr2:true,localProjectSubpath:true,refreshClears:true,consoleErrors:errors,externalRequests:network,manualRouteSimulations:[1,2,3,4,5]};
 fs.writeFileSync(path.join(out,'test-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
