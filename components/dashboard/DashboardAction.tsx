"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, VideoIcon, ImageIcon } from "lucide-react";
import { useState } from "react";
import { PostTypes, User } from "@/schema/types/types.d";
import http from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import postSchema from "@/schema/postSchema";
import { z } from "zod";
type DashboardActionProps = {
  user: User;
  setPosts: React.Dispatch<React.SetStateAction<PostTypes[]>>;
};

export default function DashboardAction({
  user,
  setPosts,
}: DashboardActionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isForMedia, setIsForMedia] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      images: [],
      videos: [],
    },
  });

  const { handleSubmit, reset } = form;

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

      form.setValue("images", [...(form.getValues("images") || []), ...files]);
    };

    input.click();
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsForMedia(false);
    setPreviewImages([]);
  };

  return (
    <>
      <div className="flex items-start space-x-4 mb-4 p-4 bg-white dark:bg-neutral-800">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="lg"
              variant="secondary"
              className="w-full rounded-lg text-left"
            >
              {`What's on your mind, ${user?.name?.split(" ")[0]} ?`}
            </Button>
          </DialogTrigger>
          <Form {...form}>
            <form>
              <DialogContent className="sm:max-w-[455px]">
                <DialogHeader>
                  <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          autoComplete="off"
                          className="border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-ring focus:outline-none focus:border-transparent"
                          placeholder={`What's on your mind, ${
                            user?.name?.split(" ")[0]
                          } ?`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isForMedia && (
                  <>
                    <div className="mt-4 flex flex-col items-center space-y-4">
                      <Button
                        type="button"
                        variant={"ghost"}
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 rounded-lg transition-all"
                        onClick={handleImagePicker}
                      >
                        <PaperclipIcon
                          size={40}
                          className="mb-2 text-gray-500"
                        />
                        <span className="text-lg text-gray-900">
                          Add photos/videos
                        </span>
                        <span className="text-sm text-gray-400">
                          or drag and drop
                        </span>
                      </Button>
                    </div>

                    {previewImages.length > 0 && (
                      <div
                        className={`grid gap-4 mb-4 ${
                          previewImages.length <= 2
                            ? "grid-cols-1"
                            : "grid-cols-2"
                        }`}
                      >
                        {previewImages.slice(0, 3).map((url, index) => (
                          <div
                            key={index}
                            className={`relative ${
                              index === 0 && previewImages.length > 2
                                ? "col-span-2"
                                : ""
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              className="w-full h-48 object-cover shadow-md"
                            />
                            {index === 2 && previewImages.length > 3 && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold text-xl">
                                +{previewImages.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <DialogFooter>
                  <Button
                    onClick={handleSubmit((data) => {
                      onSubmit(data);
                      closeDialog();
                    })}
                    className="w-full"
                  >
                    Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Form>
        </Dialog>
      </div>

      <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center space-x-3 ml-4">
          <Button className="flex items-center space-x-2 hover:text-indigo-500">
            <VideoIcon size={20} />
            <span className="hidden sm:inline">Upload your moment</span>
          </Button>
          <Button
            type="button"
            onClick={() => {
              setIsDialogOpen(true);
              setIsForMedia(true);
            }}
            className="flex items-center space-x-2 hover:text-indigo-500"
          >
            <ImageIcon size={20} />
            <span className="hidden sm:inline">
              Show something amazing today!
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
