import { randomUUID } from 'node:crypto';
import { callDirectOpenAI } from '../src/lib/tarot/openai.server';
import { mutateWallet } from '../src/lib/tarot/wallet.server';
import { claim, settle, chargeMicroEur, inputTokenBound, OUTPUT_TOKEN_CEILING } from '../src/lib/tarot/wallet-core';
import { INSTRUCTIONS, jsonSchema } from '../src/lib/tarot/prompt';
const data = {
  question: 'Ar verta atnaujinti santykius su buvusiu partneriu?',
  cards: [
    {name:'Kalavijų Karalius (King of Swords)',position:'Dabartinė situacija',reversed:true},
    {name:'Taurių Dešimtukas (Ten of Cups)',position:'Kliūtis',reversed:false},
    {name:'Kalavijų Karalienė (Queen of Swords)',position:'Patarimas',reversed:true},
  ],
};
const id=randomUUID();
const bound=inputTokenBound({data,INSTRUCTIONS,jsonSchema});
const reserve=chargeMicroEur(bound,OUTPUT_TOKEN_CEILING);
const status=await mutateWallet(w=>claim(w,id,reserve,'migration-live-qa'));
if(status!=='allowed') throw new Error(`LIVE_QA: budget gate ${status}`);
let accounted=false;
let diagnostics: Promise<void> = Promise.resolve();
const checkedFetch: typeof fetch=async (...args)=>{
  const response=await fetch(...args);
  if(!response.ok){
    let code='unknown';
    try {const e=await response.clone().json(); if(typeof e.error?.code==='string' && /^[a-z_]{1,80}$/.test(e.error.code)) code=e.error.code;}catch{}
    console.log(`LIVE_QA_PROVIDER: HTTP ${response.status}; code=${code}`);
  }
  if(response.ok) diagnostics=response.clone().text().then(text=>{
    for(const line of text.split('\n')) {
      if(!line.startsWith('data:')) continue;
      try {
        const event=JSON.parse(line.slice(5));
        if(['response.failed','response.incomplete','error'].includes(event.type)) {
          const safe={type:event.type,code:event.response?.error?.code||event.error?.code||event.code,reason:event.response?.incomplete_details?.reason};
          console.log('LIVE_QA_DIAGNOSTIC',JSON.stringify(safe,(_,v)=>typeof v==='string'&&!/^[a-z0-9_.-]{1,100}$/i.test(v)?'[omitted]':v));
        }
      } catch {}
    }
  }).catch(()=>{});
  return response;
};
const result=await callDirectOpenAI(data,process.env,checkedFetch,{
 maxOutputTokens:OUTPUT_TOKEN_CEILING,
 async onUsage(u){
  if(u.input_tokens>bound||u.output_tokens>OUTPUT_TOKEN_CEILING) throw new Error('LIVE_QA: usage outside bound');
  const charge=chargeMicroEur(u.input_tokens,u.output_tokens);
  accounted=await mutateWallet(w=>settle(w,id,charge));
  console.log('LIVE_QA_USAGE',JSON.stringify({...u,conservative_eur:charge/1e6,accounted}));
 }
});
await diagnostics;
console.log('LIVE_QA_RESULT',JSON.stringify(result));
if(!result.ok||!accounted) throw new Error('LIVE_QA: generation or accounting did not pass');
