"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import axios from "axios";
import http from "@/lib/utils";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getToken, getUser, setToken, setUser } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import loginSchema from "@/schema/LoginScheme";
import { Loader, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/lib/actions/auth";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [toggleShowPassword, setToggleShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { watch, handleSubmit, control } = form;
  const email = watch("email");

  useEffect(() => {
    if (email.trim() !== "" && email.endsWith(".com")) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  }, [email]);

  useEffect(() => {
    if (showPassword && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [showPassword]);

  const navigate = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    await loginUser(values, dispatch, navigate.push);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
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
            <div
              className={`transition-all duration-500 ease-in-out ${
                showPassword
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={toggleShowPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          ref={(e) => {
                            field.ref(e);
                            passwordInputRef.current = e;
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setToggleShowPassword((prev) => !prev)} // Toggle between true and false
                        >
                          {toggleShowPassword ? (
                            <Eye className="text-gray-500" />
                          ) : (
                            <EyeOff className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="w-full dark:text-gray-50"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <Loader className="animate-spin text-white" size={20} />
                  <span>Logging in...</span>
                </div>
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
      <div className="relative text-center text-sm after:absolute after:inset-0 mt-4 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-5">
        <Button
          type="button"
          onClick={() => navigate.push("/password-reset")}
          variant="outline"
          className="w-full"
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
}
