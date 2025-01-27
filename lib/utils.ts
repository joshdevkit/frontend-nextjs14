import { API_URL } from "@/server";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default http;
