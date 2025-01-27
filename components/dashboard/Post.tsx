import { getUser } from "@/redux/authSlice";
import { PostTypes } from "@/schema/types/types.d";
import { useState } from "react";
import { useSelector } from "react-redux";
import PostContents from "./PostContents";
import { MoreHorizontal } from "lucide-react";

interface PostProps {
  post: PostTypes;
}

export default function Post({ post }: PostProps) {
  const user = useSelector(getUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className="p-6 border rounded-lg shadow-lg bg-white dark:bg-neutral-800 dark:border-neutral-700 relative"
      onClick={() => setIsDropdownOpen(false)}
    >
      {post.user._id === user?._id && (
        <div
          className="absolute top-2 right-2 cursor-pointer rounded-full hover:bg-gray-200 dark:hover-bg-gray-800 dark:hover:text-neutral-900"
          onClick={toggleDropdown}
        >
          <MoreHorizontal size={24} />
          {isDropdownOpen && (
            <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-md shadow-md p-2 z-50">
              <button className="block px-4 py-2 text-gray-700">Edit</button>
              <button className="block px-4 py-2 text-red-500">Delete</button>
            </div>
          )}
        </div>
      )}

      <PostContents post={post} />
    </div>
  );
}
