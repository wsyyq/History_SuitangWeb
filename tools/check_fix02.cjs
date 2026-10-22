/* FIX01 actual offline browser acceptance; no production dependencies. */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert'),http=require('http'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/fix02'),file=require('url').pathToFileURL(path.join(root,'index.html')).href;
const expected={Q02:'两京制。隋文帝定都长安，隋炀帝迁都洛阳，将长安降为陪都。',Q03:'功能：秋收后按收成缴纳粮食，饥荒时开仓赈灾。\n影响：初期备荒救灾稳定社会，后期官办化、赋税化。',Q05:'大运河连接经济与政治军事中心。',Q16:'核心判断标准：现在中国有没有当前领土。',Q18:'中央集权削弱\n边防空虚\n唐朝由盛转衰\n藩镇割据\n严重破坏北方经济\n经济重心开始南移',Q21:'不利于中央集权\n客观上延续了唐朝的统治'};
const migrations={'sui-prosper--granary':'sui-prosper--sui-prosper','sui-end--yangdi':'sui-end--sui-poem','tang-relations--jiaohe':'tang-relations--huihe','tang-relations--tribute':'tang-relations--tubo','tang-relations--alliance':'tang-relations--frontier','tang-relations--ethnic-policy':'tang-relations--map-669','an-impact--an-process':'an-impact--an-impact','an-impact--army-source':'an-impact--fanzhen','tang-end--five':'tang-end--huangchao','five--chairong':'five--five'};
fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});try{
const c=await browser.newContext({offline:true,viewport:{width:1280,height:720}}),p=await c.newPage(),errors=[],network=[];
p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
const ready=id=>p.waitForFunction(id=>document.body.dataset.pageId===id&&window.LessonBoard?.snapshot()?.ready,id);
async function go(id,target=id){await p.evaluate(id=>location.hash=id,id);await ready(target);}
const state=()=>p.evaluate(()=>LessonApp.getState()),snap=()=>p.evaluate(()=>LessonBoard.snapshot());
async function step(previous=false){await p.waitForTimeout(270);await p.locator(`[data-qa-action="${previous?'previous':'continue'}"]`).click();await p.waitForFunction(()=>LessonBoard.snapshot()?.ready);}
const shot=name=>p.screenshot({path:path.join(out,name+'.png')});
await p.goto(file);await ready('title');
const data=await p.evaluate(()=>({sections:LESSON.sections,flows:LESSON.flows,modules:LESSON.modules,reviews:LESSON.reviewItems,notes:LESSON.teachingNotes,pages:LessonApp.getPages()}));
const questions=Object.values(data.flows).flatMap(g=>g.items),ids=Object.keys(data.pages);
assert.deepEqual([3,data.modules.length,ids.length,Object.keys(data.flows).length,questions.length,data.reviews.length],[3,6,23,12,15,4]);
assert.deepEqual(data.modules.map(m=>m.targetMinutes),[3,8,13,7,6,3]);
for(const id of Object.keys(migrations)){assert(!data.pages[id]);assert(!data.notes[id]);}
assert(!data.notes['an-cause--an-cause']);assert(data.pages['an-process--an-process']);assert(data.pages['five--five']);assert(data.pages['tang-relations--map-669']);
for(const qid of ['Q13','Q14','Q19','Q20'])assert(!questions.some(q=>q.questionId===qid));
for(const [id,text] of Object.entries(expected))assert.equal(questions.find(q=>q.questionId===id).answer,text);
assert.equal(data.reviews[3].answer,expected.Q16);assert.equal(data.reviews[0].answer,questions.find(q=>q.questionId==='Q04').answer);
assert(!JSON.stringify(data).includes('Q06/Q19'));
const baseline=JSON.parse(fs.readFileSync(path.join(root,'review/fix01/baseline.json'))),viewports=[];let layouts=0,entries=0,operations=0;
const routes=['title','standard','outline',...data.modules.map(m=>m.id),...ids,...ids.flatMap(id=>data.sections[data.pages[id].section].flows.map(f=>`flow/${f}/${id}`)),...Array.from({length:4},(_,i)=>`review/${i}`)];
for(const [width,height] of [[1920,1080],[1366,768],[1280,720]]){
 await p.setViewportSize({width,height});
 for(const id of routes){await go(id);const check=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),overlap:(()=>{const b=document.querySelector('#board-viewport').getBoundingClientRect();return [...document.querySelectorAll('.masthead,#navigation,#lesson-progress,.mode-dock')].some(e=>{const r=e.getBoundingClientRect();return r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top;});})()}));assert.deepEqual(check,{overflow:false,broken:[],overlap:false},`${width} ${id}`);layouts++;}
 await go('sui-prosper--sui-prosper');const board=await p.locator('#board-viewport').boundingBox(),before=baseline.viewports.find(v=>v.width===width).board;assert(board.height>before.height+150);viewports.push({width,height,before,after:board,heightGain:board.height-before.height});await shot(`after-${width}`);
}
// Every real hotspot, every question and exact source return. Check reveal geometry too.
for(const id of ids){await go(id);const links=await p.locator('.hotspot').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 for(const href of links){await p.locator(`.hotspot[href="${href}"]`).click();await ready(href.slice(1));entries++;const list=data.flows[href.split('/')[1]].items;
  for(let i=0;i<list.length;i++){assert.equal((await state()).questionId,list[i].questionId);assert.equal((await state()).revealed,false);const before=await snap();await step();operations++;const after=await snap();assert.deepEqual([after.base,after.x,after.y,after.height],[before.base,before.x,before.y,before.height]);
   const q=list[i];if(expected[q.questionId]){assert.equal((await p.locator('#qa-answer').innerText()).trim(),expected[q.questionId]);assert.equal(await p.locator('.question-source,.answer-explanation,.concept-model,.history-sequence').count(),0);}
   if(q.questionId==='Q05'){assert.equal(await p.locator('.teacher-map img').count(),1);await shot('q05-teacher-map');}
   await step();operations++;
  }await ready(id);
 }
 // selectors, previous and next resolve to the dynamically retained tree.
 const siblingIds=data.modules.find(m=>m.id===data.pages[id].module).sections.flatMap(s=>data.sections[s].assets.map(a=>`${s}--${a}`)),n=siblingIds.indexOf(id);
 for(const [slot,target] of [[1,siblingIds[n-1]],[2,siblingIds[n+1]]]){const button=p.locator('#navigation .nav-button').nth(slot);if(target){assert.equal(await button.getAttribute('href'),'#'+target);await button.click();await ready(target);await go(id);}else assert(await button.isDisabled());}
 assert.equal(await p.locator('#fragment option').count(),data.sections[data.pages[id].section].assets.length);
}
// Removed bookmarks and removed source fragments never fall back to an empty screen.
let migrated=0;for(const [old,target] of Object.entries(migrations)){await go(old,target);migrated++;const section=data.pages[target].section;for(const f of data.sections[section].flows){await go(`flow/${f}/${old}`,`flow/${f}/${target}`);await p.locator('#navigation a').first().click();await ready(target);migrated++;}}
await go('flow/map-reading/tang-relations--map-669','tang-relations--map-669');await go('flow/map-reading/invalid','tang-relations--map-669');migrated+=2;
assert.equal(await p.locator('a[href*="map-reading"]').count(),0);assert.equal(await p.locator('[data-map-object]').count(),5);
for(const id of ['turks','huihe','tubo','mohe']){await p.locator(`[data-map-object="${id}"]`).click();assert.equal(await p.locator(`[data-map-mark="${id}"]`).getAttribute('visibility'),'visible');}
await shot('map-669');await go('an-cause--an-cause');assert.equal(await p.locator('.teaching-note').count(),0);await shot('cause-textbook-only');await go('an-impact--an-impact');assert.match(await p.locator('#textbook-surface img').getAttribute('src'),/crosspage-merged/);await shot('impact-merged');await go('tang-relations--frontier');assert.equal(await p.locator('.thinking-point img').count(),1);await shot('retained-thinking-point');
await go('flow/canal/sui-prosper--sui-prosper');assert(await p.locator('[data-qa-action="previous"]').isDisabled());await step();await step();assert.equal((await state()).questionId,'Q05');await step(true);assert.equal((await state()).questionId,'Q04');assert.equal((await state()).revealed,false);
await p.waitForTimeout(270);await p.locator('[data-qa-action="continue"]').dblclick();assert.equal((await state()).questionId,'Q04');assert.equal((await state()).revealed,true);
await go('sui');await go('tang');await p.goBack();await ready('sui');await p.goForward();await ready('tang');
await go('review/3');assert.equal(await p.locator('.review-card').count(),4);assert.equal(await p.locator('#review-card-3 .review-answer').innerText(),expected.Q16);assert.equal(await p.locator('#review-card-3 .review-boundary,#review-card-3 .review-source').count(),0);await shot('review-four-cards');
// Panel geometry and accessible controls, Escape closes panel before page navigation.
await go('sui-prosper--sui-prosper');for(const b of await p.locator('#interaction-toolbar [data-mode]').all()){const box=await b.boundingBox();assert(box.width>=44&&box.height>=44);assert(await b.getAttribute('aria-label'));assert(await b.getAttribute('title'));assert.equal(await b.locator('svg').count(),1);}
await p.locator('#tool-panel-toggle').click();await p.waitForTimeout(80);const panel=await p.locator('#tool-panel').boundingBox(),board=await p.locator('#board-viewport').boundingBox();assert(panel.x+panel.width<=board.x);await shot('tools-expanded');await p.keyboard.press('Escape');assert(await p.locator('#tool-panel').isHidden());assert.equal((await state()).id,'sui-prosper--sui-prosper');await p.keyboard.press('Tab');assert.notEqual(await p.evaluate(()=>document.activeElement.tagName),'BODY');
await go('unknown-route','title');assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
const teacher=fs.readFileSync(path.join(root,'assets/teacher/sui_canal_granary_map.png'));assert.equal(crypto.createHash('sha256').update(teacher).digest('hex'),'5a0a0492417368bb290ebe702317f9b6f3ec0dbb8093ad3e26e29a048785591f');
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({status:'passed',counts:{top:3,modules:6,fragments:ids.length,groups:Object.keys(data.flows).length,questions:questions.length,reviews:4},layouts,entries,operations,migrated,viewports,errors,externalRequests:network,hardware:'Headless Edge; no physical whiteboard or public deployment tested'},null,2));
console.log(JSON.stringify({status:'passed',layouts,entries,operations,migrated,viewports},null,2));await c.close();
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
