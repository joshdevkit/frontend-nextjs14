"use client";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import resetSchema from "@/schema/resetSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader } from "lucide-react";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import http from "@/lib/utils";
import { toast } from "sonner";

export default function ResetForm() {
  const [isVerficationSent, setIsVerficationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, control, reset } = form;
  const navigate = useRouter();
  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      const response = await http.post("/password-reset", values);
      setIsVerficationSent(true);
      reset({
        email: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.warning(error.response?.data?.message || error.message, {
          duration: 3000,
        });
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Recover your Account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to proceed.
        </p>
      </div>
      {isVerficationSent && (
        <Alert className="mt-4 bg-green-500 text-gray-50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Reset password link has been sent to your email. Please check your
            email.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 mt-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Please wait...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => navigate.push("/login")}
                variant="outline"
                className="w-full"
              >
                Login and try again
              </Button>
              <Button
                type="button"
                onClick={() => navigate.push("/signup")}
                variant="outline"
                className="w-full"
              >
                Register new account
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
