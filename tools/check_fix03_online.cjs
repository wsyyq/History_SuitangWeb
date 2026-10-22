// Read-only public comparison; never uploads or deploys.
const fs=require('fs'),path=require('path');
module._compile(fs.readFileSync(path.join(__dirname,'check_stage7_online.cjs'),'utf8').replaceAll('review/stage7','review/fix03'),__filename);
