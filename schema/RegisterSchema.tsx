import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: "Fullname is required",
    }),
    email: z.string().min(2, {
      message: "Email is required",
    }),
    password: z.string().min(2, {
      message: "Password is required",
    }),
    confirmPassword: z.string().min(0, {
      message: "Confirm Password is required",
    }),
  })
  .superRefine((data, ctx) => {
    const { password, confirmPassword } = data;
    if (password && confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password and Confirm Password does not match",
        path: ["confirmPassword"],
      });
    }
  });

export default registerSchema;
