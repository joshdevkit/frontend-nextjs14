import { PostTypes } from "@/schema/types/types.d";
import { useEffect, useState } from "react";
import PostActions from "./PostActions";

interface PostContentsProps {
  post: PostTypes;
}

export default function PostContents({ post }: PostContentsProps) {
  const imageCount = post.images.length;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal(event as any);
    }
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    setCurrentIndex(null);
  };

  const goToNextImage = () => {
    if (currentIndex !== null && currentIndex < imageCount - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(post.images[currentIndex + 1]);
    }
  };

  const goToPreviousImage = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(post.images[currentIndex - 1]);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [selectedImage]);

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={"https://github.com/shadcn.png"}
          alt="User Avatar"
          className="w-7 h-7 bg-gray-300 dark:bg-neutral-700 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-lg text-gray-900 dark:text-white">
            {post.user.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {post.createdAt}
          </p>
        </div>
      </div>

      <p className="text-base text-gray-800 dark:text-gray-50 leading-relaxed mb-4">
        {post.content}
      </p>

      {post.images.length > 0 && (
        <div
          className={`grid gap-4 mt-4 ${
            imageCount === 1
              ? "grid-cols-1"
              : imageCount === 2
              ? "grid-cols-1"
              : "grid-cols-3"
          }`}
        >
          {post.images.slice(0, 3).map((image, idx) => (
            <div
              key={idx}
              className={`relative ${imageCount === 1 && "col-span-1"} ${
                imageCount === 1 || imageCount === 2
                  ? "w-full h-full"
                  : "w-auto h-auto"
              }`}
            >
              <img
                src={image}
                alt={`Post Image ${idx}`}
                className={`w-full h-full object-cover shadow-md cursor-pointer ${
                  idx === 2 && imageCount > 3 ? "blur-[1px]" : ""
                }`}
                onClick={() => handleImageClick(image, idx)}
              />
              {imageCount > 3 && idx === 2 && (
                <span
                  className="absolute top-1/2 left-1/2 
                transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-2 py-2 text-xs rounded-md z-10"
                >
                  +{imageCount - 3}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <PostActions
        belongsTo={post.user}
        postData={post}
        selectedImage={selectedImage}
        currentIndex={currentIndex}
        imageCount={imageCount}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
        closeModal={closeModal}
      />
    </div>
  );
}
