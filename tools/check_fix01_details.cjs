const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert'),http=require('http');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/fix01'),file=require('url').pathToFileURL(path.join(root,'index.html')).href;
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});let server;try{
const precision=[],errors=[],external=[];let settings=0,clearConfirmed=false;
for(const dpr of [1,2]){
 const c=await browser.newContext({offline:true,deviceScaleFactor:dpr,viewport:{width:1280,height:720}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});let accept=false;p.on('dialog',d=>accept?d.accept():d.dismiss());
 const ready=()=>p.waitForFunction(()=>window.LessonBoard?.snapshot()?.ready),snap=()=>p.evaluate(()=>LessonBoard.snapshot());
 async function go(id){await p.evaluate(id=>location.hash=id,id);await p.waitForFunction(id=>LessonApp.getState().id===id&&LessonBoard.snapshot()?.ready,id);}
 async function step(){await p.waitForTimeout(270);await p.locator('[data-qa-action="continue"]').click();await ready();}
 const mode=id=>p.locator(`#interaction-toolbar [data-mode="${id}"]`).click();const action=id=>p.locator(`[data-action="${id}"]`).click();
 await p.goto(file+'#flow/canal/sui-prosper--sui-prosper');await ready();await step();await step();await step();
 await p.locator('#tool-panel-toggle').click();await p.waitForTimeout(100);await mode('select');
 const v=await p.locator('#board-viewport').boundingBox(),im=await p.locator('.teacher-map img').boundingBox();await p.mouse.move(v.x+v.width*.9,v.y+v.height*.5);await p.mouse.wheel(0,im.y-v.y-35);await p.waitForTimeout(100);
 const pt=await p.locator('.teacher-map img').evaluate(i=>{const r=i.getBoundingClientRect();return{x:r.x+r.width*.5,y:r.y+r.height*.5};});
 await mode('draw');await p.mouse.click(pt.x,pt.y);const marker=(await snap()).strokes[0].id;
 async function error(){return p.evaluate(id=>{const im=document.querySelector('.teacher-map img').getBoundingClientRect(),dot=document.querySelector(`[data-stroke-id="${id}"]`).getBoundingClientRect();return Math.hypot(dot.x+dot.width/2-im.x-im.width/2,dot.y+dot.height/2-im.y-im.height/2);},marker);}
 precision.push(await error());await mode('zoom');for(let n=0;n<4;n++){const dot=await p.locator(`[data-stroke-id="${marker}"]`).boundingBox();await p.mouse.click(dot.x+dot.width/2,dot.y+dot.height/2);}assert.equal((await snap()).zoom,3);precision.push(await error());
 await mode('move');await p.mouse.move(v.x+v.width*.6,v.y+v.height*.5);await p.mouse.down();await p.mouse.move(v.x+v.width*.6-60,v.y+v.height*.5-30,{steps:5});await p.mouse.up();assert.equal((await snap()).strokes.length,1);precision.push(await error());
 await p.screenshot({path:path.join(out,`q05-ink-3x-dpr${dpr}.png`)});await action('reset');precision.push(await error());
 await p.setViewportSize({width:1366,height:768});await p.waitForTimeout(100);precision.push(await error());
 await go('sui');await go('flow/canal/sui-prosper--sui-prosper');await step();await step();assert.equal((await snap()).strokes.length,1);await step();precision.push(await error());
 // Reveal Q06 has its own board and retains its full four-node content.
 await step();assert.equal(await p.evaluate(()=>LessonApp.getState().questionId),'Q06');assert.equal((await snap()).strokes.length,0);
 await go('an-cause--an-cause');await mode('draw');
 for(const color of ['#c52f25','#146f9b','#202020','#a66b00'])for(const width of ['2','4','8']){await p.locator(`[data-color="${color}"]`).click();await p.selectOption('#pen-width',width);const box=await p.locator('#board-viewport').boundingBox();await p.mouse.click(box.x+box.width*.4,box.y+box.height*.4);const stroke=(await snap()).strokes.at(-1);assert.equal(stroke.color,color);assert.equal(stroke.width,+width);settings++;}
 const count=(await snap()).strokes.length;await action('clear');assert.equal((await snap()).strokes.length,count);accept=true;await action('clear');assert.equal((await snap()).strokes.length,0);await action('undo');assert.equal((await snap()).strokes.length,count);clearConfirmed=true;
 // Map buttons do not select while drawing/moving; selection reset cannot erase ink.
 await go('tang-relations--map-669');await mode('draw');await p.locator('[data-map-object="tubo"]').click();assert.equal(await p.locator('[data-map-object="tubo"]').getAttribute('aria-pressed'),'false');const ink=(await snap()).strokes.length;await mode('move');await p.locator('[data-map-object="tubo"]').click();assert.equal((await snap()).strokes.length,ink);assert.equal(await p.locator('[data-map-object="tubo"]').getAttribute('aria-pressed'),'false');await mode('select');await p.locator('[data-map-object="tubo"]').click();await p.locator('[data-map-object=""]').click();assert.equal((await snap()).strokes.length,ink);
 // Long content can be scrolled to its final line without footer/panel occlusion.
 for(const id of ['five--map-five','an-impact--an-impact','flow/canal/sui-prosper--sui-prosper']){await go(id);if(id.startsWith('flow')){await step();await step();await step();}const box=await p.locator('#board-viewport').boundingBox();await p.mouse.move(box.x+box.width*.8,box.y+box.height*.5);await p.mouse.wheel(0,100000);await p.waitForTimeout(100);const b=await snap();assert(Math.abs(b.y-Math.min(0,box.height-b.height*b.base))<1);await p.screenshot({path:path.join(out,`bottom-${id.split('/')[0]}-dpr${dpr}.png`)});}
 await c.close();
}
assert(Math.max(...precision)<.01);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
// All active textbook and flow entry routes under a Pages-like project subpath.
server=http.createServer((req,res)=>{const url=decodeURIComponent(req.url.split('?')[0]);if(!url.startsWith('/History_SuitangWeb/')){res.writeHead(404);res.end();return;}const target=path.join(root,url.slice('/History_SuitangWeb/'.length));fs.readFile(target,(e,b)=>{if(e){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'html':'text/html; charset=utf-8','js':'application/javascript; charset=utf-8','css':'text/css; charset=utf-8','png':'image/png'})[target.split('.').pop()]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const c=await browser.newContext(),p=await c.newPage(),requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)requests.push([r.status(),r.url()]);});p.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))external.push(r.url());});await p.goto(`http://127.0.0.1:${server.address().port}/History_SuitangWeb/index.html`);await p.waitForFunction(()=>window.LessonBoard?.snapshot()?.ready);
const routes=await p.evaluate(()=>Object.keys(LessonApp.getPages()).flatMap(id=>[id,...LESSON.sections[LessonApp.getPages()[id].section].flows.map(f=>`flow/${f}/${id}`)]));
for(const id of routes){await p.evaluate(id=>location.hash=id,id);await p.waitForFunction(id=>LessonApp.getState().id===id&&LessonBoard.snapshot()?.ready,id);assert.equal(await p.locator('img').evaluateAll(es=>es.filter(i=>!i.naturalWidth).length),0);}
await p.evaluate(()=>location.hash='flow/canal/sui-prosper--sui-prosper');await p.waitForFunction(()=>LessonApp.getState().flow==='canal');for(let i=0;i<3;i++){await p.waitForTimeout(280);await p.locator('[data-qa-action="continue"]').click();}await p.waitForFunction(()=>document.querySelector('.teacher-map img')?.naturalWidth===416);
assert.deepEqual(requests,[]);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
const result={status:'passed',teacherMapAlignmentErrors:precision,maxError:Math.max(...precision),colorWidthCombinations:settings,clearCancelConfirmUndo:clearConfirmed,dpr:[1,2],subpathRoutes:routes.length,errors,externalRequests:external};fs.writeFileSync(path.join(out,'details-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));await c.close();
}finally{if(server)await new Promise(r=>server.close(r));await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
