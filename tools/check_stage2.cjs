/* Dev-only acceptance test. Requires Playwright supplied through NODE_PATH.
   BROWSER_EXECUTABLE optionally selects an installed Edge/Chrome executable. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const {pathToFileURL}=require('url');
const http=require('http');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/stage2');
const file=pathToFileURL(path.join(root,'index.html')).href;
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
 const context=await browser.newContext({offline:true});
 const page=await context.newPage(),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
 async function expectRoute(id){await page.waitForFunction(x=>document.body.dataset.pageId===x,id);}
 async function go(id){await page.goto(file+'#'+id);await page.waitForFunction(x=>document.body.dataset.pageId===x,id);await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));}
 async function checkLayout(){return page.evaluate(()=>{
  const w=innerWidth,h=innerHeight;
  const bad=[...document.querySelectorAll('header,footer,#navigation a,#navigation button,.hotspot,.page-head h1')].filter(e=>{const r=e.getBoundingClientRect();return r.left<-.5||r.right>w+.5||r.top<-.5||r.bottom>h+.5;}).map(e=>e.textContent);
  return {overflow:document.documentElement.scrollWidth>w,bad,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)};
 });}
 await go('title');
 const model=await page.evaluate(()=>({modules:LESSON.modules,sections:LESSON.sections,flows:LESSON.flows,pages:LessonApp.getPages()}));
 const pageIds=Object.keys(model.pages),flowRoutes=pageIds.flatMap(p=>model.sections[model.pages[p].section].flows.map(f=>'flow/'+f+'/'+p));
 const routes=['title','standard','outline',...model.modules.map(m=>m.id),...pageIds,...flowRoutes,...[0,1,2,3].map(i=>'review/'+i)];
 const dimensions=[{width:1920,height:1080},{width:1366,height:768},{width:1280,height:720}];
 let layouts=0,hotspots=0;
 for(const size of dimensions){
  await page.setViewportSize(size);
  for(const id of routes){await go(id);const result=await checkLayout();assert.deepEqual(result,{overflow:false,bad:[],broken:[]},JSON.stringify({id,size,result}));layouts++;}
  for(const [label,id] of Object.entries({title:'title',outline:'outline',textbook:'sui-prosper--sui-prosper',map669:'tang-relations--map-669',mapFive:'five--map-five',review:'review',flow:'flow/canal/sui-prosper--sui-prosper'})){
   await go(id);await page.screenshot({path:path.join(out,`${label}-${size.width}x${size.height}.png`)});
  }
 }
 // Every actual hotspot, including all fragment-origin combinations, must return exactly.
 for(const p of pageIds){await go(p);const hrefs=await page.locator('.hotspot').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
  for(const href of hrefs){await page.locator(`.hotspot[href="${href}"]`).click();assert.equal(await page.locator('body').getAttribute('data-level'),'4');await page.getByRole('link',{name:'返回触发此问题的教材片段',exact:true}).click();await expectRoute(p);hotspots++;}
 }
 // Teacher's three manual routes, native selects and keyboard behavior.
 await go('title');await page.getByRole('link',{name:'开始授课　→',exact:true}).click();await expectRoute('standard');
 await page.locator('#navigation').getByRole('link',{name:'下一页 →',exact:true}).click();
 await page.locator('.module-card[href="#sui"]').click();await page.locator('.section-link[href="#sui-prosper--sui-prosper"]').click();
 await page.locator('.hotspot[href="#flow/canal/sui-prosper--sui-prosper"]').click();await page.keyboard.press('Escape');await expectRoute('sui-prosper--sui-prosper');
 await go('outline');await page.locator('.module-card[href="#tang"]').click();await page.locator('.section-link[href="#tang-relations--turks-intro"]').click();await page.selectOption('#fragment','tang-relations--map-669');await page.locator('h1').click();await page.keyboard.press('Escape');await expectRoute('tang');
 await go('outline');await page.locator('.module-card[href="#review"]').click();assert.equal(await page.locator('.review-card').count(),4);assert.equal(await page.locator('main img').count(),0);await page.keyboard.press('ArrowRight');await expectRoute('review/1');await page.keyboard.press('Escape');await expectRoute('outline');
 await go('title');await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.body.dataset.pageId==='standard');await page.keyboard.press('ArrowLeft');await page.waitForFunction(()=>document.body.dataset.pageId==='title');
 await go('sui-found--sui-found');assert.equal(await page.locator('.hotspot').count(),0);
 await go('sui-end--yangdi');await page.getByRole('link',{name:'完成本模块',exact:true}).click();await expectRoute('sui');
 await go('tang-relations--huihe');await page.focus('#fragment');await page.keyboard.press('ArrowRight');await expectRoute('tang-relations--jiaohe');await page.focus('#fragment');await page.keyboard.press('Escape');assert.equal(await page.locator('body').getAttribute('data-page-id'),'tang-relations--jiaohe');
 await go('tang-relations--huihe');await page.locator('#textbook-viewport').evaluate(e=>e.scrollTop=200);const scroll=await page.locator('#textbook-viewport').evaluate(e=>e.scrollTop);await page.locator('.hotspot').first().click();await page.goBack();await page.waitForFunction(()=>document.body.dataset.pageId==='tang-relations--huihe');assert.equal(await page.locator('#textbook-viewport').evaluate(e=>e.scrollTop),scroll);
 await page.goto(file+'#invalid-route');await page.waitForFunction(()=>document.body.dataset.pageId==='title');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 // Serve under a project subpath; not an online deployment.
 const server=http.createServer((req,res)=>{let pathname=decodeURIComponent(req.url.split('?')[0]);if(!pathname.startsWith('/History_SuitangWeb/')){res.writeHead(404);return res.end();}let rel=pathname.slice('/History_SuitangWeb/'.length)||'index.html';const target=path.resolve(root,rel);if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png'})[path.extname(target)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const online=await browser.newContext(),p2=await online.newPage();const badHttp=[];p2.on('response',r=>{if(r.status()>=400)badHttp.push(r.url());});
 await p2.goto(`http://127.0.0.1:${server.address().port}/History_SuitangWeb/index.html#tang-relations--map-669`);await p2.locator('#textbook-surface img').evaluate(i=>i.decode());assert.equal(await p2.locator('body').getAttribute('data-page-id'),'tang-relations--map-669');assert.deepEqual(badHttp,[]);
 await online.close();await new Promise(r=>server.close(r));
 const report={browser:await browser.version(),executable:process.env.BROWSER_EXECUTABLE||'bundled Chromium',offline:true,transport:'file://',dimensions,modules:model.modules.length,sections:Object.keys(model.sections).length,fragments:pageIds.length,flowGroups:Object.keys(model.flows).length,routeCount:routes.length,layoutChecks:layouts,hotspotRoundTrips:hotspots,scriptErrors:errors,externalRequests:external,localSubpath:'passed; not deployed online',keyboard:true,historyAndScroll:true,status:'passed'};
 fs.writeFileSync(path.join(out,'test-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
