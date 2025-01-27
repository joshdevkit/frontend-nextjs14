// actions.ts
import { Dispatch } from "redux";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { setToken, setUser } from "@/redux/authSlice";
import http from "../utils";
import loginSchema from "@/schema/LoginScheme";
import registerSchema from "@/schema/RegisterSchema";

export const loginUser = async (
  values: z.infer<typeof loginSchema>,
  dispatch: Dispatch,
  navigate: (path: string) => void
) => {
  try {
    const response = await http.post("/auth/login", values);
    const data = response.data;
    console.log(data);

    if (data.token && data.user) {
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));

      navigate("/dashboard");
    } else {
      toast.warning("Something went wrong.", {
        duration: 3000,
        position: "top-center",
      });
    }
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      toast.warning(error.response?.data?.message || error.message, {
        duration: 3000,
        description:
          "Don't worry, you can easily reset your password and get back on track.",
        position: "top-center",
        action: {
          label: "Reset Password",
          onClick: () => navigate("/password-reset"), // Use the navigate function here
        },
      });
    } else {
      // Handle unexpected errors
      toast.error("An unexpected error occurred. Please try again later.", {
        duration: 3000,
        position: "top-center",
      });
    }
  }
};

export const registerUser = async (
  values: z.infer<typeof registerSchema>,
  dispatch: Dispatch,
  navigate: (path: string) => void
) => {
  try {
    const response = await http.post("/auth/register", values);
    const data = response.data;
    console.log(data);
    if (data.token && data.user) {
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
      navigate("/dashboard");
    } else {
      toast.warning("Something went wrong during registration.", {
        duration: 3000,
        position: "top-center",
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data.error);
      if (
        error.response?.data.error ===
        "User validation failed: email: Please enter a valid email address"
      ) {
        toast.warning("Please provide a valid email address.");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } else {
      toast.error("An unexpected error occurred. Please try again later.", {
        duration: 3000,
        position: "top-center",
      });
    }
  }
};
