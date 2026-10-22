const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/fix01');
const sandbox={window:{}};for(const f of ['textbook-assets','lesson-data','question-data','teaching-notes','stage6-content'])vm.runInNewContext(fs.readFileSync(path.join(root,`js/${f}.js`),'utf8'),sandbox);
const data=JSON.parse(JSON.stringify(sandbox.window)),baseline=JSON.parse(fs.readFileSync(path.join(out,'baseline.json')));
const changed=['Q02','Q03','Q05','Q16','Q18','Q21'];let unchanged=0;
for(const g of Object.values(data.LESSON.flows))for(const q of g.items)if(!changed.includes(q.questionId)){assert.deepStrictEqual(q,baseline.flows[g.id].items.find(v=>v.questionId===q.questionId));unchanged++;}
const tracked=execFileSync('git',['-c','core.fsmonitor=false','ls-files','-z'],{cwd:root}).toString('utf8').split('\0').filter(Boolean);
const sources=tracked.filter(f=>f.startsWith('assets/textbook/')&&f.endsWith('.png')||['隋唐讲解框架.md','隋唐讲解原文.md','课标截图.png'].includes(f)||f.endsWith('.pdf'));
const hashes=[];for(const f of sources){const head=execFileSync('git',['-c','core.fsmonitor=false','show',`HEAD:${f}`],{cwd:root,maxBuffer:50*1024*1024}),bytes=fs.readFileSync(path.join(root,f)),sha=crypto.createHash('sha256').update(bytes).digest('hex');
 const pointer=head.toString('utf8').match(/^version https:\/\/git-lfs.github.com\/spec\/v1\noid sha256:([a-f0-9]+)/);if(pointer)assert.equal(sha,pointer[1],f);else assert.deepStrictEqual(bytes,head,f);hashes.push({path:f,sha256:sha,headMatches:true});}
assert.equal(sources.filter(f=>f.startsWith('assets/textbook/')).length,32);
const activePages=Object.values(data.LESSON.sections).flatMap(s=>s.assets.map((a,i)=>({id:`${s.id}--${a}`,module:s.module,section:s.id,index:i,asset:data.TEXTBOOK_ASSETS[a].path,flows:s.flows})));
const result={status:'passed',unchangedQuestions:unchanged,originalSources:hashes.length,hashes,activePages,flows:data.LESSON.flows,reviews:data.LESSON.reviewItems};
fs.writeFileSync(path.join(out,'source-and-content-check.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:'passed',unchangedQuestions:unchanged,originalSources:hashes.length,activePages:activePages.length}));
