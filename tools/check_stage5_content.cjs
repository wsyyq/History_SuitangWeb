/* Content boundaries, readable scrolling and seven stage-5 teaching routes. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm'),crypto=require('crypto');
const {execFileSync}=require('child_process'),{pathToFileURL}=require('url');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/stage5');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const old=vm.createContext({window:{}});
for(const f of ['js/lesson-data.js','js/question-data.js'])vm.runInContext(execFileSync('git',['-c','core.fsmonitor=false','show','HEAD:'+f],{cwd:root,encoding:'utf8'}),old);
const prior=JSON.parse(JSON.stringify(old.window.LESSON));
const expectedIds=['Q02','Q03','Q04','Q05','Q06','Q07','Q08','Q09','Q11'];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
 try{
 const c=await browser.newContext({offline:true,viewport:{width:1280,height:720}}),p=await c.newPage();
 const errors=[],external=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
 await p.goto(pathToFileURL(path.join(root,'index.html')).href);
 async function ready(id){await p.waitForFunction(id=>LessonApp.getState().id===id&&LessonBoard.snapshot()?.ready,id);}
 async function go(id){await p.evaluate(id=>location.hash=id,id);await ready(id);}
 async function step(){await p.waitForTimeout(270);await p.locator('[data-qa-action="continue"]').click();await p.waitForFunction(()=>LessonBoard.snapshot()?.ready);}
 const snap=()=>p.evaluate(()=>LessonBoard.snapshot());
 async function scrollTo(selector){const v=await p.locator('#board-viewport').boundingBox(),r=await p.locator(selector).boundingBox();await p.mouse.move(v.x+v.width*.8,v.y+v.height*.5);await p.mouse.wheel(0,r.y-v.y-16);await p.waitForTimeout(70);}
 async function reset(){await p.locator('[data-action="reset"]').click();}
 async function shot(name){await p.screenshot({path:path.join(out,name+'.png')});}
 await ready('title');const data=await p.evaluate(()=>JSON.parse(JSON.stringify(LESSON))),pages=await p.evaluate(()=>LessonApp.getPages());
 assert.deepEqual(data.modules,prior.modules);assert.deepEqual(data.sections,prior.sections);assert.deepEqual(data.reviewItems,prior.reviewItems);
 const changed=Object.values(data.flows).flatMap(g=>g.items.filter(q=>q.contentVersion==='stage5'));
 assert.deepEqual(changed.map(q=>q.questionId),expectedIds);assert.equal(Object.keys(data.teachingNotes).length,12);
 let untouched=0;for(const [id,g] of Object.entries(data.flows)){assert.deepEqual(g.qids,prior.flows[id].qids);for(const q of g.items){if(!expectedIds.includes(q.questionId)){assert.deepEqual(q,prior.flows[id].items.find(x=>x.questionId===q.questionId));untouched++;}}}
 assert.equal(untouched,10);
 for(const [id,note] of Object.entries(data.teachingNotes)){assert(pages[id]);assert(['sui-found','sui-prosper','sui-end','tang-found','tang-prosper'].includes(pages[id].section));assert.match(note.sourceRef,/教材 PDF/);assert(note.blocks.every(b=>['textbook-supported','teacher-extension'].includes(b.evidenceType)));}
 const find=id=>changed.find(q=>q.questionId===id);
 assert.equal(find('Q06').timeline.length,4);assert.equal(find('Q05').diagram.title,'教师讲解示意，非历史地图');assert.equal(find('Q05').assetStatus,'asset-missing');
 for(const id of ['Q06','Q07','Q08'])assert.equal(find(id).contentStatus,'needs-verification');
 assert.equal(find('Q04').answerBlocks.find(b=>b.title==='文化').evidenceType,'teacher-extension');
 const n=data.teachingNotes;assert.match(n['sui-found--sui-found'].blocks[0].text,/杨坚.*定都长安/);assert.match(n['sui-found--sui-found'].blocks[1].title,/589/);assert.match(n['tang-found--tang-found'].blocks[0].text,/李渊在长安/);assert.match(n['tang-prosper--tang-prosper'].blocks[1].text,/改国号周/);
 for(const word of ['短曲辕','犁评','犁壁'])assert(find('Q11').answer.includes(word));
 // Compare every textbook asset and the supplied standards screenshot to committed bytes.
 const assets=fs.readdirSync(path.join(root,'assets/textbook')).filter(f=>f.endsWith('.png')).map(f=>'assets/textbook/'+f).concat('课标截图.png');
 for(const f of assets)assert.equal(sha(fs.readFileSync(path.join(root,f))),sha(execFileSync('git',['-c','core.fsmonitor=false','show','HEAD:'+f],{cwd:root,maxBuffer:16*1024*1024})));
 let anchorChecks=0,answerScrollChecks=0,minCorePixels=Infinity;
 for(const [width,height] of [[1920,1080],[1366,768],[1280,720]]){
  await p.setViewportSize({width,height});
  for(const [id,note] of Object.entries(n)){
   await go(id);assert.equal(await p.locator('.teaching-note').count(),1);assert((await p.locator('.teaching-note').innerText()).includes(note.blocks[0].text));
   assert.equal(await p.locator('.hotspot').count(),data.sections[pages[id].section].flows.length);
   await scrollTo('.teaching-note');const y=(await snap()).y;await p.mouse.wheel(0,2000);await p.waitForTimeout(70);
   const box=await p.locator('.note-source').boundingBox(),v=await p.locator('#board-viewport').boundingBox();assert(box.y>=v.y-1&&box.y+box.height<=v.y+v.height+1);assert((await snap()).y<=y);
   const size=await p.locator('.teaching-note .content-block p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));assert(size*(await snap()).base>=20);
   if(width===1280&&['sui-found--sui-found','sui-end--sui-end','tang-found--tang-found','tang-prosper--tang-prosper','tang-prosper--plough-text','tang-prosper--sancai'].includes(id)){await scrollTo('.teaching-note');await shot('route-'+id);}
   anchorChecks++;
  }
  for(const g of Object.values(data.flows).filter(g=>g.items.some(q=>q.contentVersion==='stage5'))){
   const origin=Object.keys(pages).find(id=>pages[id].section===g.subtopicId);await go(`flow/${g.id}/${origin}`);
   for(let i=0;i<g.items.length;i++){
    const q=g.items[i];assert(await p.locator('#qa-answer').isHidden());const before=await snap();await step();assert.equal((await snap()).height,before.height);
    assert(!/待填充/.test(await p.locator('.qa-card > .badge').innerText()));if(q.contentStatus==='needs-verification')assert.match(await p.locator('#qa-answer > h3').first().innerText(),/待核对/);
    const coreSelector=q.answerBlocks?'#qa-answer .content-block p':'#qa-answer .core-answer';
    const cssSize=await p.locator(coreSelector).first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));minCorePixels=Math.min(minCorePixels,cssSize*(await snap()).base);assert(cssSize*(await snap()).base>=22);
    await scrollTo('#qa-answer');if(width===1280||q.questionId==='Q04')await shot(`answer-${q.questionId}-${width}`);
    const beforeScroll=await snap();await p.mouse.wheel(0,4000);await p.waitForTimeout(70);assert((await snap()).y<beforeScroll.y||beforeScroll.y<0);
    const source=await p.locator('.question-source').boundingBox(),v=await p.locator('#board-viewport').boundingBox();assert(source.y+source.height<=v.y+v.height+1);
    const footer=await p.locator('[data-qa-action="continue"]').boundingBox();assert(footer.y>=v.y+v.height);assert(footer.y+footer.height<=height);
    answerScrollChecks++;await step();
   }
   await ready(origin);
  }
 }
 // At 3x, ink remains attached to an actual new answer landmark while the whole stage scrolls.
 await go('flow/canal/sui-prosper--sui-prosper');await step();await scrollTo('#qa-answer');
 const landmark=await p.locator('#qa-answer .content-block').first().boundingBox();await p.locator('[data-tool="pen"]').click();await p.mouse.click(landmark.x+landmark.width*.4,landmark.y+landmark.height*.5);assert.equal((await snap()).strokes.length,1);const id=(await snap()).strokes[0].id;
 const drift=()=>p.evaluate(id=>{const a=document.querySelector('#qa-answer .content-block').getBoundingClientRect(),b=document.querySelector(`[data-stroke-id="${id}"]`).getBoundingClientRect();return Math.hypot((a.x+a.width*.4)-(b.x+b.width/2),(a.y+a.height*.5)-(b.y+b.height/2));},id);
 const errorsXY=[await drift()];for(let i=0;i<4;i++)await p.locator('[data-action="plus"]').click();errorsXY.push(await drift());await p.locator('[data-mode="move"]').click();const v=await p.locator('#board-viewport').boundingBox();await p.mouse.move(v.x+400,v.y+200);await p.mouse.down();await p.mouse.move(v.x+320,v.y+150,{steps:5});await p.mouse.up();errorsXY.push(await drift());await reset();errorsXY.push(await drift());assert(Math.max(...errorsXY)<1);
 await step();assert.equal((await snap()).strokes.length,0);await p.waitForTimeout(270);await p.locator('[data-qa-action="previous"]').click();assert.equal((await snap()).strokes.length,1);assert(await p.locator('#qa-answer').isHidden());await p.locator('#navigation a').first().click();await ready('sui-prosper--sui-prosper');
 // Unfilled stage-6 routes and review remain accessible, with no stage-5 anchors or new answers.
 for(const route of ['flow/relations/tang-relations--map-669','flow/impact/an-impact--an-impact','flow/five-flow/five--map-five']){await go(route);await step();assert.match(await p.locator('#qa-answer').innerText(),/待第五／六阶段填充/);assert.equal(await p.locator('.teaching-note').count(),0);await p.locator('#navigation a').first().click();}
 await go('review');assert.equal(await p.locator('.review-answer:visible').count(),4);for(const text of await p.locator('.review-answer').allInnerTexts())assert.match(text,/待第五／六阶段填充/);await shot('route-review-unchanged');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const report={status:'passed',browser:await browser.version(),filledGroups:6,handledQuestions:9,textbookCoreQuestions:5,teacherModelQuestions:1,verificationMethodQuestions:3,unchangedLaterQuestions:untouched,unchangedReviewCards:4,teachingAnchorPages:12,anchorLayoutChecks:anchorChecks,answerScrollChecks,minCoreTextCssPixels:minCorePixels,answerInkErrorPixels:errorsXY,unchangedAssetFiles:assets.length,offlineFile:true,consoleErrors:errors,externalRequests:external,manualRouteCoverage:[1,2,3,4,5,6,7],physicalDeviceTest:false};
 fs.writeFileSync(path.join(out,'content-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
