import { getUser } from "@/redux/authSlice";
import { PostTypes } from "@/schema/types/types.d";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSelector } from "react-redux";

interface PostActionsProps {
  belongsTo: PostTypes["user"];
  postData: PostTypes;
  selectedImage: string | null;
  currentIndex: number | null;
  imageCount: number;
  goToNextImage: () => void;
  goToPreviousImage: () => void;
  closeModal: (e: React.MouseEvent) => void;
}

export default function PostActions({
  belongsTo,
  postData,
  selectedImage,
  currentIndex,
  imageCount,
  goToNextImage,
  goToPreviousImage,
  closeModal,
}: PostActionsProps) {
  const user = useSelector(getUser);

  return (
    selectedImage && (
      <div
        className="fixed inset-0 bg-neutral-950 bg-opacity-100 flex justify-center items-center z-50"
        onClick={closeModal}
      >
        <div
          className="relative flex w-full h-full max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full sm:w-1/2 md:w-3/4 h-full relative">
            <img
              src={selectedImage}
              alt="Full-Screen Preview"
              className="w-full h-full object-contain"
            />
            <button
              className="absolute right-2 top-4 text-neutral-50 bg-gray-900 rounded-full p-2 hover:bg-gray-700"
              onClick={closeModal}
            >
              <X size={24} />
            </button>
            <button
              className={`absolute rounded-full px-1 py-1 left-4 top-1/2 transform bg-black 
            -translate-y-1/2 text-white transition-transform duration-200 
            ${
              currentIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:-translate-x-4"
            }`}
              onClick={goToPreviousImage}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={40} />
            </button>

            <button
              className={`absolute rounded-full px-1 py-1 right-4 top-1/2 transform bg-black 
            -translate-y-1/2 text-white transition-transform duration-200 
            ${
              currentIndex === imageCount - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:translate-x-4"
            }`}
              onClick={goToNextImage}
              disabled={currentIndex === imageCount - 1}
            >
              <ChevronRight size={40} />
            </button>
          </div>

          <div className="hidden sm:flex sm:w-1/2 md:w-1/4 h-full justify-end items-start p-4 bg-neutral-800 text-white">
            <div className="flex flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-black">
                  <span className="text-lg font-bold">
                    {belongsTo.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">
                    {belongsTo._id === user?._id ? "You" : belongsTo.name}
                  </h4>
                  <p className="text-sm">{postData.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
