import {spawnSync} from "node:child_process";
const steps=[["npm",["run","test"]],["npm",["run","typecheck"]],["node",["--experimental-strip-types","scripts/budget-canary.ts"]],["node",["scripts/ledger-status.mjs"]],["node",["scripts/run-upright-comparison.mjs"]],["node",["scripts/ledger-status.mjs"]],["npm",["run","build"]]];
for(const [command,args] of steps){
 const result=spawnSync(command,args,{stdio:"inherit",env:{...process.env,QA_CANDIDATE_ONLY:"true",NITRO_PRESET:"vercel"}});
 if(result.status!==0)process.exit(result.status??1);
}
