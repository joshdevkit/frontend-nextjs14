import { PostTypes } from "@/schema/types/types.d";

interface PostProps {
  post: PostTypes;
}

export default function Post({ post }: PostProps) {
  const imageCount = post.images.length;

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={"https://github.com/shadcn.png"}
          alt="User Avatar"
          className="w-7 h-7 bg-gray-300 dark:bg-neutral-700 rounded-full object-cover"
        />
        <p className="font-semibold text-lg text-gray-900 dark:text-white">
          {post.user.name}
        </p>
      </div>
      <p className="text-base text-gray-800 dark:text-gray-400 leading-relaxed mb-4">
        {post.content}
      </p>
      {post.images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {post.images.slice(0, 3).map((image, idx) => (
            <div
              key={idx}
              className={`relative ${
                idx === 2 && imageCount > 3 ? "flex justify-center" : ""
              }`}
            >
              <img
                src={image}
                alt={`Post Image ${idx}`}
                className={`w-full h-full border border-gray-200 object-cover ${
                  idx === 2 && imageCount > 3 ? "blur-[2px]" : ""
                }`}
              />
              {idx === 2 && imageCount > 3 && (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-2 py-2 text-xs rounded-md z-10">
                  +{imageCount - 3}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
