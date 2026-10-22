// Preserve the accepted assertions; update only authorized curriculum expectations.
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/fix03/final');fs.mkdirSync(out,{recursive:true});
if(process.argv[2]){
 const name=process.argv[2],file=name==='routes'?'check_fix02.cjs':name==='extended'?'check_stage7_extended.cjs':`check_fix02_${name}.cjs`;
 let source=fs.readFileSync(path.join(__dirname,file),'utf8').replaceAll('review/fix02','review/fix03/final').replaceAll('review/stage7','review/fix03');
 if(name==='routes')source=source.replace('[3,6,23,12,15,4]','[3,6,23,13,15,4]').replace("['Q13','Q14','Q19','Q20']","['Q07','Q08','Q09','Q13','Q14','Q19','Q20']");
 // These four files are deliberately changed under FIX03. Artwork, original text,
 // textbook asset config, and interaction code are checked by snapshot_fix03 too.
 if(name==='ui')source=source.replace("'js/lesson-data.js','js/question-data.js','js/stage6-content.js','js/teaching-notes.js',",'');
 module._compile(source,__filename);
}else{
 const start=new Date().toISOString();Promise.all(['routes','whiteboard','details','ui','extended'].map(name=>new Promise(resolve=>{let log='';const p=spawn(process.execPath,[__filename,name],{env:process.env,windowsHide:true});p.stdout.on('data',b=>log+=b);p.stderr.on('data',b=>log+=b);p.on('close',code=>{fs.writeFileSync(path.join(out,name+'.log'),log);console.log(name+': '+code);resolve({name,exitCode:code,command:`node tools/check_fix03_regression.cjs ${name}`});});}))).then(tests=>{fs.writeFileSync(path.join(out,'run.json'),JSON.stringify({start,end:new Date().toISOString(),node:process.version,tests},null,2));process.exitCode=tests.some(t=>t.exitCode!==0)?1:0;});
}
