import { rolldown } from 'rolldown';
const build=await rolldown({input:'scripts/live-reading-canary.ts',platform:'node',external:['@vercel/blob','zod',/^node:/]});
await build.write({file:'.qa/live-reading.mjs',format:'esm'});
await build.close();
await import('../.qa/live-reading.mjs');
