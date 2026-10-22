// Reuse validated assertions; isolate stage7 evidence from historical reports.
const fs=require('fs'),path=require('path');
const run=process.env.STAGE7_RUN||'final';if(!['baseline','final'].includes(run))throw Error('Invalid run');
const source=fs.readFileSync(path.join(__dirname,'check_fix02.cjs'),'utf8').replaceAll('review/fix02','review/stage7/'+run);
module._compile(source,__filename);
