import { z } from "zod";

const postSchema = z.object({
  content: z.string().min(0, {
    message: "",
  }),
  images: z.array(z.any()).optional(), // Accept raw File objects
  videos: z.array(z.string()).optional(), // No changes here for videos
});

export default postSchema;
