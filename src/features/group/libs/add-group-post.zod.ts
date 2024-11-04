import { z } from "zod";

const zAddGroupPostInputs = z.object({
  title: z.string().min(5).max(100),
  body: z.string().min(10).max(1000),
  groupId: z.string(),
  images: z.array(z.instanceof(File)).min(0).max(5),
});

type ztAddGroupPostInputs = z.infer<typeof zAddGroupPostInputs>;

export { zAddGroupPostInputs, ztAddGroupPostInputs };
