import { z } from "zod";

const zAddLivestreamInputs = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
});

type ztAddLivestreamInputs = z.infer<typeof zAddLivestreamInputs>;

export { zAddLivestreamInputs, ztAddLivestreamInputs };
