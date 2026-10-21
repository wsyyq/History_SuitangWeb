/* Supplemental reading and navigation QA; same dev-only environment as check_stage2.cjs. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),assert=require('assert');
const {pathToFileURL}=require('url');
(async()=>{
 const root=path.resolve(__dirname,'..'),url=pathToFileURL(path.join(root,'index.html')).href;
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
 const ctx=await browser.newContext({offline:true,viewport:{width:1280,height:720}});const p=await ctx.newPage();
 const records=[];
 for(const id of ['tang-relations--map-669','five--map-five','an-impact--army-source']){
  await p.goto(url+'#'+id);await p.locator('#textbook-surface img').evaluate(i=>i.decode());
  await p.locator('#textbook-viewport').evaluate(e=>e.scrollTop=e.scrollHeight);
  const info=await p.evaluate(()=>{const v=document.querySelector('#textbook-viewport'),i=document.querySelector('#textbook-surface img');return {scrollTop:v.scrollTop,imageBottom:i.getBoundingClientRect().bottom,viewportBottom:v.getBoundingClientRect().bottom};});
  assert(info.imageBottom<=info.viewportBottom);records.push({id,...info});
  await p.screenshot({path:path.join(root,'review/stage2',id.replace('--','-')+'-bottom-1280x720.png')});
 }
 await p.goto(url+'#title');const ids=await p.evaluate(()=>Object.keys(LessonApp.getPages()));let clicked=0;
 for(const id of ids){
  await p.goto(url+'#'+id);const targets=await p.locator('#navigation a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
  for(const [buttonIndex,target] of targets.entries()){
   await p.goto(url+'#'+id);await p.locator("#navigation a").nth(buttonIndex).click();await p.waitForFunction(x=>document.body.dataset.pageId===x,target.slice(1));clicked++;
  }
 }
 const result={status:'passed',offline:true,resolution:'1280x720',bottomReadability:records,navigationClicks:clicked};
 fs.writeFileSync(path.join(root,'review/stage2/reading-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
