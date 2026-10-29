// Safe operational summary: no credentials, visitor identifiers or reading contents.
import {get} from '@vercel/blob';
const response=await get('tarot-budget/v1/wallet.json',{access:'private',useCache:false,headers:{'accept-encoding':'identity'}});
if(!response?.stream) throw new Error('Budget ledger unavailable');
const wallet=await new Response(response.stream).json();
console.log('BUDGET_STATUS',JSON.stringify({spentConservativeMicroEur:wallet.spent,pendingCount:Object.keys(wallet.pending).length,heldMicroEur:Object.values(wallet.pending).reduce((sum,item)=>sum+item.reserve,0),fault:wallet.fault}));
