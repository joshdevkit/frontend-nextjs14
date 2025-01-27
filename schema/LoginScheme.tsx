import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(2, {
    message: "Email is requied",
  }),
  password: z.string().min(2, {
    message: "Password is requied",
  }),
});

export default loginSchema;
