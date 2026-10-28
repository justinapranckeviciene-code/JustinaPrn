import { createServerFn } from "@tanstack/react-start";

export const getPublicConfig = createServerFn({ method: "GET" }).handler(async () => {
  const value = process.env["COFFEE_URL"];
  if (!value) return { coffeeUrl: null };
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
      return { coffeeUrl: null };
    return { coffeeUrl: url.href };
  } catch {
    return { coffeeUrl: null };
  }
});
