import { randomUUID } from "node:crypto";
import { callDirectOpenAI } from "../src/lib/tarot/openai.server";
import { mutateWallet } from "../src/lib/tarot/wallet.server";
import { claim, settle, chargeMicroEur, inputTokenBound, OUTPUT_TOKEN_CEILING } from "../src/lib/tarot/wallet-core";
import { INSTRUCTIONS, jsonSchema } from "../src/lib/tarot/prompt";
import { INSTRUCTIONS as PREVIOUS } from "../audit/before-upright/prompt";
import { DECK, SPREAD_POSITIONS } from "../src/lib/tarot/deck";
const cases = [
  ["R1","santykiai","Ar verta atnaujinti santykius su buvusiu partneriu?",["major-19","major-15","minor-1-7"]],
  ["R2","santykiai","Ar jo tylėjimas įrodo, kad jis mane apgaudinėja?",["major-18","major-2","minor-2-7"]],
  ["D1","darbas","Ar verta priimti vadovo pareigas, jei komanda nuolat konfliktuoja?",["major-4","minor-0-5","major-8"]],
  ["D2","darbas","Kaip grįžti į darbą po nesėkmingo projekto?",["major-16","minor-3-8","major-17"]],
  ["F1","finansai","Ar verta visas santaupas skirti draugo siūlomam verslui?",["major-19","minor-3-4","major-15"]],
  ["F2","finansai","Kaip suvaldyti augančias kasdienes išlaidas?",["minor-3-2","minor-1-9","major-14"]],
  ["S1","sprendimai","Ar šiuo metu verta persikelti gyventi į kitą miestą?",["major-0","major-12","major-7"]],
  ["S2","sprendimai","Kaip apsispręsti tarp saugaus darbo ir kūrybinės veiklos?",["minor-2-2","minor-3-10","minor-0-1"]],
] as const;
for(const [id,category,question,ids] of cases) {
  const cards=ids.map((id,i)=>{
    const c=DECK.find(c=>c.id===id)!;
    return {name:c.name+" ("+c.nameEn+")",position:SPREAD_POSITIONS[i]!,reversed:false};
  });
  for(const [version,instructions] of [["previous",PREVIOUS],["candidate",INSTRUCTIONS]] as const) {
    const data={question,cards};
    const requestId=randomUUID();
    const bound=inputTokenBound({data,INSTRUCTIONS:instructions,jsonSchema});
    const reserve=chargeMicroEur(bound,OUTPUT_TOKEN_CEILING);
    const status=await mutateWallet(w=>claim(w,requestId,reserve,"upright-qa-"+id+"-"+version));
    if(status!=="allowed") {
      console.log("UPRIGHT_QA_STOP",JSON.stringify({id,version,reason:status}));
      throw new Error("Comparison stopped at the existing budget/rate gate");
    }
    let accounted=false;
    const result=await callDirectOpenAI(data,process.env,fetch,{
      instructions,maxOutputTokens:OUTPUT_TOKEN_CEILING,
      async onUsage(usage) {
        if(usage.input_tokens>bound||usage.output_tokens>OUTPUT_TOKEN_CEILING) throw new Error("Usage outside bound");
        accounted=await mutateWallet(w=>settle(w,requestId,chargeMicroEur(usage.input_tokens,usage.output_tokens)));
      }
    });
    // Only authored synthetic questions and readings are emitted; no visitors' data or secrets.
    const record=JSON.stringify({id,category,version,question,cards,...result,accounted});
    for(let offset=0,part=0;offset<record.length;offset+=900,part++){
      console.log("UPRIGHT_QA_CHUNK",JSON.stringify({id,version,part,text:record.slice(offset,offset+900)}));
    }
    if(!result.ok||!accounted) throw new Error("Comparison response or accounting failed");
    await new Promise(r=>setTimeout(r,6500));
  }
}
console.log("UPRIGHT_QA_COMPLETE: 8 paired cases, 16 accounted responses");
