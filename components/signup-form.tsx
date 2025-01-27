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
import { getToken, getUser, setToken } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AtSignIcon, Key, Loader, Lock, UserCircle2 } from "lucide-react";
import Link from "next/link";
import registerSchema from "@/schema/RegisterSchema";
import { registerUser } from "@/lib/actions/auth";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control } = form;

  const token = useSelector(getToken);
  const user = useSelector(getUser);
  const navigate = useRouter();
  const dispatch = useDispatch();

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    await registerUser(values, dispatch, navigate.push);
    setLoading(false);
  }

  useEffect(() => {
    if (token && user) {
      navigate.push("/dashboard");
    }
  }, [token, user, navigate]);

  return (
    <div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Let's make a difference!
        </p>
      </div>
      <div className="grid gap-6 mt-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="pr-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSignIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="johndoe@example.com"
                        {...field}
                        className="pr-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        ref={(e) => {
                          field.ref(e);
                          passwordInputRef.current = e;
                        }}
                        className="pr-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                        className="pr-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <Loader className="animate-spin text-white" size={20} />
                  <span>Creating your account...</span>
                </div>
              ) : (
                <span>Register</span>
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </div>
  );
}
