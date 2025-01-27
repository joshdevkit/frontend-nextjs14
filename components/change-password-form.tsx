"use client";
import changePasswordSchema from "@/schema/changePasSchema";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircleIcon, Check, Loader, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import http from "@/lib/utils";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

interface ChangePasswordFormProps {
  id: string;
}

export default function ChangePasswordForm({ id }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [initialButtonState, setInitialButtonState] = useState(false);
  const searchParams = useSearchParams();
  const paramValue = searchParams.get("token");
  const navigate = useRouter();

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      id: id,
    },
  });

  const password = form.watch("password");
  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Password ";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  const checkTokenValidity = async () => {
    try {
      const response = await http.post("/validate-token", {
        userID: id,
        token: paramValue,
      });
      if (response.data.isExpired) {
        setIsExpired(true);
      } else if (!response.data.isValid) {
        setIsValid(false);
      }
    } catch (error: any) {
      console.error("Error checking token validity");
      setIsValid(false);
    }
  };

  useEffect(() => {
    if (paramValue) {
      checkTokenValidity();
    }
  }, [paramValue]);

  const { handleSubmit, control, reset } = form;

  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    setIsLoading(true);
    try {
      const response = await http.post("/update-password", values);
      console.log(response);
      if (response.data.isUpdated) {
        toast.success(response.data.message);
        reset({
          password: "",
          confirmPassword: "",
          id: "",
        });
        setTimeout(() => {
          navigate.push("/login");
        }, 1500);
      }
    } catch (error: any) {
      console.log(error);
      toast.warning(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isExpired) {
    return (
      <div>
        <Alert className="mt-4 bg-red-500 text-gray-50">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Reset password link has expired. Please request a new one.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => navigate.push("/password-reset")}
          className="w-full mt-5"
          variant="default"
        >
          Request a new reset link
        </Button>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div>
        <Alert className="mt-4 bg-yellow-500 text-gray-50">
          <AlertCircleIcon className="h-6 w-6" />
          <AlertDescription>
            The reset link is invalid. Please check your email for a valid link
            or request a new one.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => navigate.push("/password-reset")}
          className="w-full mt-5"
          variant="default"
        >
          Request a new reset link
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Update your Password</h1>
        <p className="text-sm text-muted-foreground">
          Please secure your password below:
        </p>
      </div>
      <div className="grid gap-6 mt-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                      aria-invalid={strengthScore < 4}
                      aria-describedby={`${id}-description`}
                    />
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
                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password strength indicator */}
            <div
              className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Password strength"
            >
              <div
                className={`h-full ${getStrengthColor(
                  strengthScore
                )} transition-all duration-500 ease-out`}
                style={{ width: `${(strengthScore / 4) * 100}%` }}
              ></div>
            </div>

            {/* Password strength description */}
            <p
              id={`${id}-description`}
              className="mb-2 text-sm font-medium text-foreground"
            >
              {getStrengthText(strengthScore)} Must contain:
            </p>

            <ul className="space-y-1.5" aria-label="Password requirements">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <Check
                      size={16}
                      className="text-emerald-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <X
                      size={16}
                      className="text-muted-foreground/80"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-xs ${
                      req.met ? "text-emerald-600" : "text-muted-foreground"
                    }`}
                  >
                    {req.text}
                    <span className="sr-only">
                      {req.met
                        ? " - Requirement met"
                        : " - Requirement not met"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {!initialButtonState && (
              <Button
                className="w-full"
                type="submit"
                disabled={isLoading || strengthScore < 4}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Please wait...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
