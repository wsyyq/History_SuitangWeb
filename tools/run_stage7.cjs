const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const run=process.env.STAGE7_RUN||'final',out=path.resolve(__dirname,'../review/stage7',run);fs.mkdirSync(out,{recursive:true});
const start=new Date().toISOString();
Promise.all(['routes','whiteboard','details','ui'].map(name=>new Promise(resolve=>{
 const started=new Date().toISOString(),p=spawn(process.execPath,[path.join(__dirname,`check_stage7_${name}.cjs`)],{env:process.env,windowsHide:true});let log='';
 p.stdout.on('data',b=>log+=b);p.stderr.on('data',b=>log+=b);p.on('close',code=>{fs.writeFileSync(path.join(out,name+'.log'),log);console.log(name+': '+code);resolve({name,started,ended:new Date().toISOString(),exitCode:code,command:`node tools/check_stage7_${name}.cjs`});});
}))).then(tests=>{fs.writeFileSync(path.join(out,'run.json'),JSON.stringify({start,end:new Date().toISOString(),platform:process.platform,node:process.version,run,tests},null,2));process.exitCode=tests.some(t=>t.exitCode!==0)?1:0;});
