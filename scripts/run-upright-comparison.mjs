import { rolldown } from "rolldown";
const build=await rolldown({input:"scripts/upright-comparison.ts",platform:"node",external:["@vercel/blob","zod",/^node:/]});
await build.write({file:".qa/upright-comparison.mjs",format:"esm"});
await build.close();
await import("../.qa/upright-comparison.mjs");
