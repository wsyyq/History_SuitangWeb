/* Stage 6 content, map geometry, evidence boundaries and readable classroom routes. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const {execFileSync}=require('child_process'),{pathToFileURL}=require('url');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/stage6');fs.mkdirSync(out,{recursive:true});
const ctx=vm.createContext({window:{}});
for(const f of ['js/lesson-data.js','js/question-data.js','js/teaching-notes.js'])vm.runInContext(execFileSync('git',['-c','core.fsmonitor=false','show','HEAD:'+f],{cwd:root,encoding:'utf8'}),ctx);
const prior=JSON.parse(JSON.stringify(ctx.window.LESSON));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
 try{
  const c=await browser.newContext({offline:true,viewport:{width:1366,height:768}}),p=await c.newPage();
  const errors=[],external=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});p.on('dialog',d=>d.accept());
  await p.goto(pathToFileURL(path.join(root,'index.html')).href);
  const snap=()=>p.evaluate(()=>LessonBoard.snapshot());
  async function ready(id){await p.waitForFunction(id=>LessonApp.getState().id===id&&LessonBoard.snapshot()?.ready,id);}
  async function go(id){await p.evaluate(id=>location.hash=id,id);await ready(id);}
  async function mode(m){await p.locator(`#interaction-toolbar [data-mode="${m}"]`).click();}
  async function reset(){await p.locator('[data-action="reset"]').click();}
  async function scroll(selector){await mode('select');const v=await p.locator('#board-viewport').boundingBox(),r=await p.locator(selector).first().boundingBox();await p.mouse.move(v.x+v.width*.9,v.y+v.height*.5);await p.mouse.wheel(0,r.y-v.y-14);await p.waitForTimeout(70);}
  async function bottom(){const v=await p.locator('#board-viewport').boundingBox();await p.mouse.move(v.x+v.width*.8,v.y+v.height*.5);await p.mouse.wheel(0,16000);await p.waitForTimeout(70);}
  async function step(previous=false){await p.waitForTimeout(270);await p.locator(`[data-qa-action="${previous?'previous':'continue'}"]`).click();await p.waitForFunction(()=>LessonBoard.snapshot()?.ready);}
  async function shot(name){await p.screenshot({path:path.join(out,name+'.png')});}
  await ready('title');const data=await p.evaluate(()=>JSON.parse(JSON.stringify(LESSON))),pages=await p.evaluate(()=>LessonApp.getPages());
  assert.deepEqual(data.modules,prior.modules);assert.deepEqual(data.sections,prior.sections);
  let preserved=0;const mapping=[];
  for(const [id,g] of Object.entries(data.flows)){
   assert.deepEqual(g.qids,prior.flows[id].qids);
   for(const q of g.items){const old=prior.flows[id].items.find(x=>x.questionId===q.questionId);assert.equal(q.prompt,old.prompt);if(old.contentVersion==='stage5'){assert.deepEqual(q,old);preserved++;}else{assert.equal(q.contentVersion,'stage6');assert(q.answer&&q.explanation&&q.reviewNote&&q.sourceRef);assert(!q.answer.includes('待第五／六阶段'));}}
   mapping.push({groupId:id,sectionId:g.subtopicId,origins:Object.keys(pages).filter(k=>pages[k].section===g.subtopicId),items:g.items.map(q=>({id:q.questionId,before:prior.flows[id].items.find(x=>x.questionId===q.questionId).contentStatus,after:q.contentStatus,version:q.contentVersion,source:q.sourceRef}))});
  }
  assert.equal(preserved,9);
  for(const [id,note] of Object.entries(prior.teachingNotes))assert.deepEqual(data.teachingNotes[id],note);
  const newQs=Object.values(data.flows).flatMap(g=>g.items).filter(q=>q.contentVersion==='stage6');assert.equal(newQs.length,10);
  assert.deepEqual(newQs.map(q=>q.questionId),['Q12','Q13','Q14','Q15','Q16','Q18','Q19','Q20','Q21','Q23']);
  assert.equal(newQs.filter(q=>q.contentStatus==='textbook-supported').length,6);
  assert.equal(newQs.filter(q=>q.contentStatus==='teacher-extension').length,2);
  assert.equal(newQs.filter(q=>q.contentStatus==='needs-verification').length,2);
  assert.equal(data.reviewItems.length,4);assert.equal(data.reviewItems[1].contentStatus,'needs-verification');
  for(const b of prior.flows.canal.items[2].timeline)assert(data.reviewItems[1].answer.includes(b.text));
  assert.equal(data.reviewItems[0].answer,prior.flows.canal.items[0].answer);
  const newNotes=Object.entries(data.teachingNotes).filter(([,n])=>n.contentVersion==='stage6');assert.equal(newNotes.length,19);
  const assetFiles=fs.readdirSync(path.join(root,'assets/textbook')).filter(f=>f.endsWith('.png')).map(f=>'assets/textbook/'+f).concat(['课标截图.png','隋唐讲解框架.md','隋唐讲解原文.md','中外历史纲要上_PDF第41-46页.pdf']);
  const sourceHashes={};for(const f of assetFiles){const h=hash(fs.readFileSync(path.join(root,f)));const blob=execFileSync('git',['-c','core.fsmonitor=false','show','HEAD:'+f],{cwd:root,maxBuffer:16*1024*1024});const lfs=blob.toString('utf8').match(/^version https:\/\/git-lfs.github.com\/spec\/v1\r?\noid sha256:([a-f0-9]{64})/);assert.equal(h,lfs?lfs[1]:hash(blob));sourceHashes[f]=h;}
  fs.writeFileSync(path.join(out,'baseline-mapping.json'),JSON.stringify(mapping,null,2));
  let answers=0,notes=0,reviewChecks=0,mapChecks=0,minPixels=Infinity;const overlayErrors=[],inkErrors=[];
  const mapRoute='tang-relations--map-669';
  async function overlayError(){return p.evaluate(()=>{const im=document.querySelector('.location-map img').getBoundingClientRect(),cfg=LESSON.map669;return Math.max(...cfg.objects.flatMap(o=>o.boxes.map((b,i)=>{const r=document.querySelector(`[data-map-mark="${o.id}"]`).children[i].getBoundingClientRect();return Math.max(Math.abs(r.x-(im.x+b[0]/cfg.width*im.width)),Math.abs(r.y-(im.y+b[1]/cfg.height*im.height)),Math.abs(r.width-b[2]/cfg.width*im.width),Math.abs(r.height-b[3]/cfg.height*im.height));})));});}
  for(const [width,height] of [[1920,1080],[1366,768],[1280,720]]){
   await p.setViewportSize({width,height});
   for(const [id,n] of newNotes){assert(pages[id]);await go(id);assert((await p.locator('.teaching-note').innerText()).includes(n.blocks[0].text));await bottom();const s=await p.locator('.note-source').boundingBox(),v=await p.locator('#board-viewport').boundingBox();assert(s.y>=v.y-1&&s.y+s.height<=v.y+v.height+1);notes++;if(width===1366&&['tang-relations--frontier','an-cause--an-cause','tang-end--huangchao','five--five'].includes(id)){await scroll(n.sequence?'.history-sequence':'.teaching-note');await shot('route-'+id);}}
   for(const g of Object.values(data.flows).filter(g=>g.items[0].contentVersion==='stage6')){
    const origin=Object.keys(pages).find(id=>pages[id].section===g.subtopicId);await go(`flow/${g.id}/${origin}`);
    for(const q of g.items){assert(await p.locator('#qa-answer').isHidden());const s=await snap();await step();assert.equal((await snap()).height,s.height);assert((await p.locator('#qa-answer').innerText()).includes(q.answer));const size=await p.locator('.core-answer').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));minPixels=Math.min(minPixels,size*s.base);assert(size*s.base>=23);await scroll('#qa-answer');if(width===1366)await shot('answer-'+q.questionId);await bottom();const v=await p.locator('#board-viewport').boundingBox(),end=await p.locator('.question-source').boundingBox();assert(end.y+end.height<=v.y+v.height+1);answers++;await step();}
    await ready(origin);
   }
   await go('review');assert.equal(await p.locator('.review-card').count(),4);assert.equal(await p.locator('#textbook-surface').count(),0);assert.equal(await p.locator('[data-qa-action]').count(),0);
   for(let i=0;i<4;i++){await scroll(`#review-card-${i}`);const text=await p.locator(`#review-card-${i}`).innerText();assert(text.includes(data.reviewItems[i].answer));const size=await p.locator(`#review-card-${i} .review-answer`).evaluate(e=>parseFloat(getComputedStyle(e).fontSize));assert(size*(await snap()).base>=23);await p.locator(`#review-card-${i} a`).focus();assert.equal(await p.evaluate(()=>document.activeElement.closest('.review-card').id),'review-card-'+i);reviewChecks++;if(width===1366&&(i===0||i===2))await shot('review-row-'+i);}
   await go(mapRoute);await scroll('.map-guide');
   const startHeight=(await snap()).height;
   for(const o of data.map669.objects){await p.locator(`[data-map-object="${o.id}"]`).click();assert.equal(await p.locator(`[data-map-mark="${o.id}"]`).getAttribute('visibility'),'visible');assert.equal(await p.locator('.map-panel:not([hidden])').innerText(),o.name+' · '+o.position+'\n'+o.text);assert.equal((await snap()).height,startHeight);overlayErrors.push(await overlayError());mapChecks++;await scroll('.location-map');if(width===1366)await shot('map-'+o.id);await scroll('.map-guide');}
   await p.locator('[data-map-object=""]').click();assert.equal(await p.locator('[data-map-mark][visibility="visible"]').count(),0);
  }
  // Keyboard selection, mode guards (mouse and keyboard), then real map-ink alignment.
  await go(mapRoute);await scroll('.map-guide');await p.locator('[data-map-object="tubo"]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-map-mark="tubo"]').getAttribute('visibility'),'visible');
  for(const m of ['draw','move','zoom']){await mode(m);await p.locator('[data-map-object="huihe"]').dispatchEvent('click',{detail:0});assert.equal(await p.locator('[data-map-mark="tubo"]').getAttribute('visibility'),'visible');const b=await p.locator('[data-map-object="huihe"]').boundingBox();await p.mouse.click(b.x+b.width/2,b.y+b.height/2);assert.equal(await p.locator('[data-map-mark="tubo"]').getAttribute('visibility'),'visible');await reset();await scroll('.map-guide');}
  await p.locator('[data-action="clear"]').click();await mode('select');await scroll('.map-guide');await p.locator('[data-map-object="tubo"]').click();
  await scroll('.location-map');const im=await p.locator('.location-map img').boundingBox();const fx=495/1696,fy=512/894;
  const pos={x:im.x+im.width*fx,y:im.y+im.height*fy};await p.locator('[data-tool="pen"]').click();await p.mouse.click(pos.x,pos.y);const marker=(await snap()).strokes.at(-1).id;
  const drift=()=>p.evaluate(({marker,fx,fy})=>{const r=document.querySelector('.location-map img').getBoundingClientRect(),d=document.querySelector(`[data-stroke-id="${marker}"]`).getBoundingClientRect();return Math.hypot(d.x+d.width/2-r.x-r.width*fx,d.y+d.height/2-r.y-r.height*fy);},{marker,fx,fy});
  inkErrors.push(await drift());for(let i=0;i<4;i++)await p.locator('[data-action="plus"]').click();assert.equal((await snap()).zoom,3);inkErrors.push(await drift());overlayErrors.push(await overlayError());
  await mode('move');let v=await p.locator('#board-viewport').boundingBox();await p.mouse.move(v.x+v.width*.6,v.y+v.height*.5);await p.mouse.down();await p.mouse.move(v.x+v.width*.6-70,v.y+v.height*.5-35,{steps:5});await p.mouse.up();inkErrors.push(await drift());overlayErrors.push(await overlayError());await shot('map-three-times');
  await reset();await scroll('.location-map');inkErrors.push(await drift());const dot=await p.locator(`[data-stroke-id="${marker}"]`).boundingBox();await p.locator('[data-tool="eraser"]').click();await p.mouse.click(dot.x+dot.width/2,dot.y+dot.height/2);assert.equal((await snap()).strokes.length,0);assert.equal(await p.locator('[data-map-mark="tubo"]').getAttribute('visibility'),'visible');await p.locator('[data-action="undo"]').click();assert.equal((await snap()).strokes.length,1);
  await scroll('.map-guide');const undo=(await snap()).undoCount;await p.locator('[data-map-object=""]').click();assert.equal((await snap()).undoCount,undo);assert.equal((await snap()).strokes.length,1);await p.locator('[data-map-object="tubo"]').click();
  await p.locator('.map-question').first().click();await ready('flow/relations/'+mapRoute);await step();await step();await step();await step();await ready(mapRoute);assert.equal((await snap()).strokes.length,1);assert.equal((await snap()).mode,'select');assert.equal((await snap()).zoom,1);assert.equal(await p.locator('[data-map-mark="tubo"]').getAttribute('visibility'),'visible');
  // Resize preserves both ink and map-image-relative coordinates.
  for(const size of [{width:1920,height:1080},{width:1366,height:768},{width:1280,height:720}]){await p.setViewportSize(size);await p.waitForTimeout(90);inkErrors.push(await drift());overlayErrors.push(await overlayError());}
  assert(Math.max(...inkErrors)<1);assert(Math.max(...overlayErrors)<1);
  await p.reload();await ready(mapRoute);assert.equal((await snap()).strokes.length,0);assert.equal(await p.locator('[data-map-mark][visibility="visible"]').count(),0);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  const report={status:'passed',browser:await browser.version(),stage6Groups:7,stage6Questions:10,evidenceCounts:{textbookCore:6,teacherMethod:2,needsVerification:2},reviewCards:4,reviewEvidenceCounts:{textbookCore:1,teacherMethod:2,needsVerification:1},preservedStage5Questions:preserved,preservedStage5Notes:Object.keys(prior.teachingNotes).length,newTeachingNotes:newNotes.length,noteLayoutChecks:notes,answerScrollChecks:answers,reviewCardChecks:reviewChecks,mapObjectChecks:mapChecks,minCoreCssPixels:minPixels,maxMapOverlayError:Math.max(...overlayErrors),maxMapInkError:Math.max(...inkErrors),mapModeGuards:true,keyboardMapAndReview:true,clearHighlightDoesNotChangeInkHistory:true,mapRoundTrip:true,refreshClears:true,sourceHashes,offlineFile:true,externalRequests:external,consoleErrors:errors,physicalDeviceTest:false};
  fs.writeFileSync(path.join(out,'content-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
