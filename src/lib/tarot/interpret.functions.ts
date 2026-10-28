import { createServerFn } from "@tanstack/react-start";
import { InputSchema } from "./contracts";
export type { Reading, InterpretResult } from "./contracts";

export const interpretReading = createServerFn({ method: "POST" })
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { generateReading } = await import("./interpret.server");
    return generateReading(data);
  });
