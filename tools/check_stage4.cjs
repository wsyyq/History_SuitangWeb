/* Development-only acceptance: Playwright + local Edge, no classroom dependency. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert'),http=require('http'),crypto=require('crypto');
const {pathToFileURL}=require('url');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/stage4');
const file=pathToFileURL(path.join(root,'index.html')).href;
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
 try{
 const c=await browser.newContext({offline:true,viewport:{width:1280,height:720}}),p=await c.newPage();
 const errors=[],external=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});p.on('dialog',d=>d.accept());
 await p.goto(file);
 const state=()=>p.evaluate(()=>LessonApp.getState());
 const ink=()=>p.evaluate(()=>LessonBoard.snapshot());
 async function ready(id){await p.waitForFunction(id=>document.body.dataset.pageId===id&&LessonBoard.snapshot()?.ready,id);}
 async function go(id){await p.evaluate(id=>location.hash=id,id);await ready(id);}
 async function step(previous=false){await p.waitForTimeout(270);await p.locator(`[data-qa-action="${previous?'previous':'continue'}"]`).click();await p.waitForFunction(()=>LessonBoard.snapshot()?.ready);}
 async function mode(value){await p.locator(`#interaction-toolbar [data-mode="${value}"]`).click();}
 async function draw(fx=.4,fy=.5){await p.locator('[data-tool="pen"]').click();const r=await p.locator('#board-viewport').boundingBox();await p.mouse.move(r.x+r.width*fx,r.y+r.height*fy);await p.mouse.down();await p.mouse.move(r.x+r.width*fx+45,r.y+r.height*fy+10,{steps:8});await p.mouse.up();}
 async function shot(name){await p.screenshot({path:path.join(out,name+'.png')});}
 await ready('title');
 const data=await p.evaluate(()=>({modules:LESSON.modules,sections:LESSON.sections,flows:LESSON.flows,reviews:LESSON.reviewItems,total:LESSON.totalMinutes,pages:LessonApp.getPages()}));
 assert.deepEqual(data.modules.map(m=>m.id),['standards','sui','tang','anshi','fall','review']);
 assert.deepEqual(data.modules.map(m=>m.targetMinutes),[3,8,13,7,6,3]);assert.equal(data.total,40);
 const groups=Object.values(data.flows),questions=groups.flatMap(g=>g.items);
 assert.equal(groups.length,13);assert.equal(questions.length,19);assert.equal(new Set(questions.map(q=>q.questionId)).size,19);
 const bank=fs.readFileSync(path.join(root,'.agents/skills/sui-tang-lesson/references/question-bank.md'),'utf8');
 assert.equal((bank.match(/^\|Q\d\d \/ /gm)||[]).length,23);
 for(const g of groups){assert.deepEqual(g.items.map(q=>q.questionId),g.qids);assert(data.sections[g.subtopicId].flows.includes(g.id));for(const q of g.items){assert(bank.includes('|'+q.questionId+' /'));assert.equal(q.contentStatus,'pending');assert.match(q.answer,/待第五／六阶段/);assert.match(q.sourceRef,/question-bank.md/);}}
 // Actual complete classroom path, including every third-level fragment and module boundary.
 await p.getByRole('link',{name:'开始授课　→',exact:true}).click();await ready('standard');await p.locator('#navigation').getByRole('link',{name:'下一页 →',exact:true}).click();await ready('outline');await shot('01-outline-plan');
 await p.locator('.module-card[href="#standards"]').click();await ready('standards');
 let fragmentVisits=0;
 for(let i=0;i<data.modules.length;i++){
  const m=data.modules[i];assert.equal((await state()).module,m.id);
  assert((await p.locator('#lesson-progress').innerText()).includes(`${i+1}/6`));assert((await p.locator('#lesson-progress').innerText()).includes(`参考 ${m.targetMinutes} 分钟`));
  if(m.sections.length){await p.locator('#navigation').getByRole('link',{name:'进入下一级',exact:true}).click();
   const ids=m.sections.flatMap(id=>data.sections[id].assets.map(a=>`${id}--${a}`));
   for(let n=0;n<ids.length;n++){await ready(ids[n]);fragmentVisits++;if(n+1<ids.length)await p.locator('#navigation a').filter({hasText:/下一片段|下一子目/}).click();}
  }
  if(i+1<data.modules.length){await p.locator('#navigation a').filter({hasText:'下一模块：'}).click();await ready(data.modules[i+1].id);}
 }
 assert.equal(fragmentVisits,33);
 for(let i=0;i<4;i++){await go(`review/${i}`);assert.equal(await p.locator('.review-card').count(),4);assert.equal(await p.locator('.review-answer:visible').count(),4);assert.equal(await p.locator('#textbook-surface').count(),0);assert.equal((await state()).level,2);}
 await p.getByRole('link',{name:'结束回顾 · 返回课堂脉络',exact:true}).click();await ready('outline');
 for(const m of data.modules){await p.locator(`.module-card[href="#${m.id}"]`).click();await ready(m.id);assert(!/已完成/.test(await p.locator('#lesson-progress').innerText()));await p.locator('.outline-link').click();await ready('outline');}
 // All existing hotspot origins: every question Q -> A -> next Q -> exact source.
 let groupEntries=0,qaOperations=0;
 for(const id of Object.keys(data.pages)){
  await go(id);
  const hrefs=await p.locator('.hotspot').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
  for(const href of hrefs){await p.locator(`.hotspot[href="${href}"]`).click();await ready(href.slice(1));groupEntries++;
   const flow=href.split('/')[1],list=data.flows[flow].items,history=await p.evaluate(()=>history.length);
   for(let q=0;q<list.length;q++){
    assert.equal((await state()).questionIndex,q);assert.equal((await state()).revealed,false);assert(await p.locator('#qa-answer').isHidden());assert.equal(await p.locator('#question-prompt').innerText(),list[q].prompt);
    assert.equal(await p.locator('#navigation a').first().getAttribute('href'),'#'+id);
    await step();qaOperations++;assert.equal((await state()).revealed,true);assert(await p.locator('#qa-answer').isVisible());assert.match(await p.locator('#qa-answer').innerText(),/待第五／六阶段/);
    assert.equal(await p.evaluate(()=>history.length),history);await step();qaOperations++;
   }
   await ready(id);
  }
 }
 // Every distinct Q and A at every required viewport; answer reveal may not reflow ink.
 let qaLayouts=0,maxRevealShift=0;
 for(const [width,height] of [[1920,1080],[1366,768],[1280,720]]){
  await p.setViewportSize({width,height});
  for(const g of groups){const origin=Object.keys(data.pages).find(id=>data.pages[id].section===g.subtopicId);await go(`flow/${g.id}/${origin}`);
   for(let n=0;n<g.items.length;n++){
    const before=await p.locator('#question-prompt').boundingBox();const beforeStage=await ink();
    for(const reveal of [false,true]){if(reveal)await step();
     const bad=await p.evaluate(()=>[...document.querySelectorAll('header,footer,#lesson-progress,#interaction-toolbar button,#navigation button,#navigation a,#question-prompt')].filter(el=>{const r=el.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5||r.top<-.5||r.bottom>innerHeight+.5;}).map(el=>el.textContent));assert.deepEqual(bad,[]);qaLayouts++;
    }
    const after=await p.locator('#question-prompt').boundingBox();maxRevealShift=Math.max(maxRevealShift,Math.abs(before.x-after.x),Math.abs(before.y-after.y));assert.equal((await ink()).height,beforeStage.height);
    if(g.id==='canal'&&n===0)await shot(`02-canal-answer-${width}`);
    if(n+1<g.items.length)await step();
   }
  }
 }
 assert.equal(maxRevealShift,0);
 const origin='sui-prosper--granary',route=`flow/canal/${origin}`;
 await go(origin);await draw(.4,.7);await draw(.55,.7);await mode('select');await p.locator(`.hotspot[href="#${route}"]`).click();await ready(route);
 // Q/A same logical board, later questions isolated; previous question resets to Q.
 assert(await p.locator('[data-qa-action="previous"]').isDisabled());await draw(.3,.5);const firstInk=(await ink()).strokes;assert.equal(firstInk.length,1);
 const strokeBox=await p.locator(`[data-stroke-id="${firstInk[0].id}"]`).boundingBox();
 const historyBefore=await p.evaluate(()=>history.length);
 await step();assert.equal((await ink()).mode,'draw');assert.deepEqual((await ink()).strokes,firstInk);assert.deepEqual(await p.locator(`[data-stroke-id="${firstInk[0].id}"]`).boundingBox(),strokeBox);
 await step();assert.equal((await ink()).mode,'select');assert.equal((await state()).questionIndex,1);assert.equal((await ink()).strokes.length,0);await draw(.6,.6);
 await step(true);assert.equal((await state()).questionIndex,0);assert.equal((await state()).revealed,false);assert.deepEqual((await ink()).strokes,firstInk);assert.equal(await p.evaluate(()=>history.length),historyBefore);await shot('03-question-ink');
 await step();await step();assert.equal((await ink()).strokes.length,1);await p.locator('#navigation a').first().click();await ready(origin);assert.equal((await ink()).strokes.length,2);
 // Browser back means previous route, never an internal Q/A state.
 await mode('select');await p.locator(`.hotspot[href="#${route}"]`).click();await ready(route);await step();await p.goBack();await ready(origin);await p.goForward();await ready(route);assert.equal((await state()).questionIndex,0);assert.equal((await state()).revealed,false);assert.equal((await ink()).strokes.length,1);
 // Modes and toolbar clicks never advance the question; explicit footer action remains usable.
 for(const m of ['draw','move','zoom']){await mode(m);const box=await p.locator('#question-prompt').boundingBox();await p.mouse.move(box.x+20,box.y+15);await p.mouse.down();await p.mouse.move(box.x+55,box.y+20,{steps:5});await p.mouse.up();assert.equal((await state()).revealed,false);assert.equal((await state()).questionIndex,0);await p.locator('[data-action="reset"]').click();}
 await p.locator('[data-color="#146f9b"]').click();await p.locator('[data-action="undo"]').click();assert.equal((await state()).revealed,false);await mode('select');await p.locator('#question-prompt').click();assert.equal((await state()).revealed,false);
 // Double-click and duplicate synthesized click cannot advance twice.
 await p.waitForTimeout(270);await p.locator('[data-qa-action="continue"]').dblclick();assert.equal((await state()).revealed,true);assert.equal((await state()).questionIndex,0);
 await p.locator('[data-qa-action="continue"]').dispatchEvent('click',{detail:0});assert.equal((await state()).questionIndex,0);
 await step();assert.equal((await state()).questionIndex,1);assert.equal((await state()).revealed,false);
 // At least 20 repeated state / previous operations and 12 route cycles without listener growth.
 for(let i=0;i<12;i++){await step(true);await step();await step();assert.equal((await state()).questionIndex,1);assert.equal((await state()).revealed,false);}
 for(let i=0;i<12;i++){await p.locator('#navigation a').first().click();await ready(origin);await p.locator(`.hotspot[href="#${route}"]`).click();await ready(route);await step();assert.equal((await state()).questionIndex,0);assert.equal((await state()).revealed,true);}
 // Relevant map route with zoomed ink, followed by Q/A, keeps originating image notes.
 await go('tang-relations--map-669');await draw(.5,.7);for(let n=0;n<4;n++)await p.locator('[data-action="plus"]').click();assert.equal((await ink()).zoom,3);await mode('move');const vr=await p.locator('#board-viewport').boundingBox();await p.mouse.move(vr.x+400,vr.y+200);await p.mouse.down();await p.mouse.move(vr.x+300,vr.y+150,{steps:4});await p.mouse.up();await shot('04-map-whiteboard');await p.locator('[data-action="reset"]').click();await mode('select');await p.locator('.hotspot[href="#flow/relations/tang-relations--map-669"]').click();await ready('flow/relations/tang-relations--map-669');await draw();assert.equal((await state()).revealed,false);await mode('select');await step();await p.locator('#navigation a').first().click();await ready('tang-relations--map-669');assert.equal((await ink()).strokes.length,1);
 await go('flow/fanzhen-flow/an-impact--army-source');await step();await step();await step();await shot('05-fanzhen-answer');await step();await ready('an-impact--army-source');
 await go('review');await draw();await p.locator('[data-action="plus"]').click();await p.locator('[data-action="reset"]').click();await mode('select');await go('review/3');assert.equal((await ink()).strokes.length,1);await shot('06-review');
 // Safe empty-list fixture and long answer fixture are in-memory only, restored by reload.
 await p.evaluate(()=>{LESSON.flows.canal.items=[];});await go(route);assert.match(await p.locator('#question-prompt').innerText(),/待后续阶段配置/);assert.equal(await p.locator('[data-qa-action="continue"]').count(),0);await p.locator('#navigation a').first().click();await ready(origin);
 await p.reload();await ready(origin);
 await p.evaluate(()=>{LESSON.flows.canal.items[0].answer='测试占位文本（非教学内容）。'.repeat(100);LESSON.flows.canal.items[0].prompt='<img src=x onerror=alert(1)> 安全渲染测试';});await go(route);assert.equal(await p.locator('#question-prompt img').count(),0);await draw(.3,.4);const longInk=await ink(),longBox=await p.locator('#question-prompt').boundingBox();await step();assert.equal((await ink()).height,longInk.height);assert.deepEqual((await ink()).strokes,longInk.strokes);assert.deepEqual(await p.locator('#question-prompt').boundingBox(),longBox);
 await p.reload();await ready(route);assert.equal((await ink()).strokes.length,0);assert.equal((await state()).revealed,false);assert.match(await p.locator('#question-prompt').innerText(),/修大运河/);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 // Local project-subpath Q/A test (not deployment).
 const prefix='/History_SuitangWeb/';
 const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(req.url.split('?')[0]);if(!pathname.startsWith(prefix)){res.writeHead(404);return res.end();}const target=path.resolve(root,pathname.slice(prefix.length)||'index.html');if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'})[path.extname(target)]||'text/plain');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{const oc=await browser.newContext(),op=await oc.newPage();await op.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html#${route}`);await op.waitForFunction(()=>LessonBoard.snapshot()?.ready);await op.locator('[data-qa-action="continue"]').click();assert(await op.locator('#qa-answer').isVisible());await oc.close();}finally{await new Promise(r=>server.close(r));}
 const expected={'隋唐讲解框架.md':'25353d34e15813425abb6e24cff65ec3dc49cc93958265f125a0cc23f640312b','隋唐讲解原文.md':'a372d2f67027211d8418b7f41680a5e0377a23a787370120ead8dc404260dbd9','中外历史纲要上_PDF第41-46页.pdf':'6adc270673507556fa3b03c53143f1ad9564130c41d87f1cbe2b240a64e540ba'};
 for(const [name,hash] of Object.entries(expected))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex'),hash);
 const report={status:'passed',browser:await browser.version(),modules:data.modules.map(m=>({id:m.id,minutes:m.targetMinutes})),totalMinutes:data.total,groups:groups.length,questions:questions.length,candidateBankCount:23,thirdLevelFragmentVisits:fragmentVisits,hotspotGroupEntries:groupEntries,questionAnswerOperations:qaOperations,questionAnswerLayoutChecks:qaLayouts,maxRevealShiftCssPixels:maxRevealShift,extraPreviousRevealNextOperations:36,questionReturnCycles:12,emptySingleMultiGroups:true,duplicateClickGuard:true,longAnswerGeometry:true,safeTextRendering:true,browserHistory:true,questionInkIsolation:true,refreshClears:true,offlineFile:true,localProjectSubpath:true,consoleErrors:errors,externalRequests:external,sourceHashes:expected,manualRouteSimulations:[1,2,3,4,5,6],physicalTouchPen:'not tested'};
 fs.writeFileSync(path.join(out,'test-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
