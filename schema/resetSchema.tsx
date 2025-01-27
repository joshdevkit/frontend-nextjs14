import { z } from "zod";

const resetSchema = z.object({
  email: z.string().min(2, {
    message: "Email is required",
  }),
});

export default resetSchema;
