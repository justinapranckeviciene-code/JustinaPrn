import { createServerFn } from "@tanstack/react-start";
import { InputSchema } from "./contracts";
export type { Reading, InterpretResult } from "./contracts";

export const interpretReading = createServerFn({ method: "POST" })
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { generateGuardedReading } = await import("./guarded.server");
    const address = getRequest().headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    return generateGuardedReading(data, address);
  });
