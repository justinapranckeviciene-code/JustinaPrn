// Credential stays in the Vercel build environment; this check generates no tokens.
const key = process.env.OPENAI_API_KEY || process.env.taro;
if (!key) throw new Error("AI_ACCESS: missing server credential");
const response = await fetch("https://api.openai.com/v1/models/gpt-6-astra", {
  headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(20000),
});
if (!response.ok) {
  let code = "unknown";
  try { const data = await response.json(); const candidate = data.error?.code; if (typeof candidate === "string" && /^[a-z_]{1,80}$/.test(candidate)) code = candidate; } catch {}
  throw new Error(`AI_ACCESS: HTTP ${response.status}; code=${code}`);
}
const model = await response.json();
if (model.id !== "gpt-6-astra") throw new Error("AI_ACCESS: unexpected model");
console.log("AI_ACCESS: original model gpt-6-astra accessible. No generation performed.");
