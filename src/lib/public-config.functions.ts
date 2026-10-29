import { createServerFn } from "@tanstack/react-start";

export const getPublicConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { aiReady } = await import("./tarot/guarded.server");
  const ready = aiReady();
  const result = (coffeeUrl: string | null) => ({ coffeeUrl, aiReady: ready });
  const value = process.env["COFFEE_URL"];
  if (!value) return result(null);
  try {
    const url = new URL(value);
    const allowed = [
      "buymeacoffee.com",
      "ko-fi.com",
      "revolut.me",
      "paypal.me",
      "www.buymeacoffee.com",
      "www.paypal.me",
      "www.paypal.com",
      "paypal.com",
    ];
    if (
      url.protocol !== "https:" ||
      !allowed.includes(url.hostname) ||
      url.username ||
      url.password
    )
      return result(null);
    return result(url.href);
  } catch {
    return result(null);
  }
});
