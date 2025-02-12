import { z } from "zod";

const zAddPostInputs = z.object({
  title: z.string().min(5).max(100),
  body: z.string().min(10).max(1000),
  images: z.union([
    z.array(z.instanceof(File)).min(0).max(4),
    z.array(z.string()).min(0).max(4),
  ]),
  fromEndUserId: z.string().optional(),
  groupId: z.string().optional(),
});

type ztAddPostInputs = z.infer<typeof zAddPostInputs>;

export { zAddPostInputs, ztAddPostInputs };
