import { z } from "zod";

const zEditProfileInputs = z.object({
  avatar: z.union([z.instanceof(File), z.string().min(0)]),
  username: z.string().min(5).max(20),
  description: z.string().min(0).max(5000),
});

type ztEditProfileInputs = z.infer<typeof zEditProfileInputs>;

export { zEditProfileInputs, ztEditProfileInputs };
