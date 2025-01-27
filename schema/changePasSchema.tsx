import { z } from "zod";

const changePasswordSchema = z
  .object({
    password: z.string().min(2, {
      message: "Password is requied",
    }),
    confirmPassword: z.string().min(0, {
      message: "Confirm Password is requied",
    }),
    id: z.string().min(2, {
      message: "ID Params is missing",
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

export default changePasswordSchema;
