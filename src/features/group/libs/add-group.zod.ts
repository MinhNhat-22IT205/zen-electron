import { z } from "zod";

const zAddGroupInputs = z.object({
  name: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  isVisible: z.boolean().default(true),
  image: z.instanceof(File),
});

type ztAddGroupInputs = z.infer<typeof zAddGroupInputs>;

export { zAddGroupInputs, ztAddGroupInputs };
