"use client";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Left from "@/components/dashboard/Left";
import Right from "@/components/dashboard/Right";
import http from "@/lib/utils";
import { getToken } from "@/redux/authSlice";
import { ImageIcon, SendHorizontalIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import postSchema from "@/schema/postSchema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { PostTypes } from "@/schema/types/types.d";
import Post from "@/components/dashboard/Post";

export default function Dashboard() {
  const token = useSelector(getToken);
  const navigate = useRouter();
  const [posts, setPosts] = useState<PostTypes[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await http.get("/post");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, []);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      images: [],
      videos: [],
    },
  });

  const handleImagePicker = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;

      const files = Array.from(target.files);
      const fileUrls = files.map((file) => URL.createObjectURL(file));

      setPreviewImages((prev) => [...prev, ...fileUrls]);

      setValue("images", [...(form.getValues("images") || []), ...files]);
    };

    input.click();
  };

  const { handleSubmit, control, reset, setValue } = form;

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    const formData = new FormData();

    formData.append("content", values.content);

    values.images?.forEach((file) => {
      formData.append("images", file);
    });

    values.videos?.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      const response = await http.post("/post/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        const newPost = response.data.post;
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        reset();
        setPreviewImages([]);
      }
    } catch (error: any) {
      console.error("Error submitting the form:", error);
    }
  };

  // useEffect(() => {
  //   if (!token) {
  //     navigate.push("/login");
  //   }
  // }, [token, navigate]);

  return (
    <AuthenticatedLayout>
      <div>
        <div className="flex">
          <Left />
          <main className="flex-1 bg-neutral-50 dark:bg-neutral-900 overflow-y-auto p-12">
            <div className="mb-6 p-2 border rounded-lg shadow-sm bg-white dark:bg-neutral-800 dark:border-neutral-700">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-start space-x-4 mb-4 p-4 bg-white dark:bg-neutral-800">
                    <div className="flex-1">
                      <FormField
                        control={control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <textarea
                                {...field}
                                className="py-2 border border-gray-200 w-full rounded-lg px-3 focus:ring-gray-500 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                placeholder=""
                                rows={4}
                              ></textarea>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {previewImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-2 ml-4">
                      <Button className="flex items-center space-x-2 hover:text-indigo-500">
                        <VideoIcon size={20} />
                      </Button>
                      <Button
                        type="button"
                        onClick={handleImagePicker}
                        className="flex items-center space-x-2 hover:text-indigo-500"
                      >
                        <ImageIcon size={20} />
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      className="p-3 mr-3 text-white rounded-lg flex items-center space-x-2 hover:bg-indigo-600"
                    >
                      <SendHorizontalIcon size={18} />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          </main>
          <Right />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
