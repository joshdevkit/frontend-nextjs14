import { getUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";

export default function Left() {
  const user = useSelector(getUser);

  return (
    <aside className="w-1/4 bg-neutral-50 dark:bg-neutral-900 p-6 hidden lg:block rounded-l-lg">
      <div className="container ml-24">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <img
              src="https://github.com/shadcn.png"
              alt="User Avatar"
              className="rounded-full"
            />
          </div>
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-4">Friends</h2>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <p className="text-sm font-medium">Friend 1</p>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <p className="text-sm font-medium">Friend 2</p>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <p className="text-sm font-medium">Friend 3</p>
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-4">Groups</h2>
          <p className="text-sm">Group 1</p>
          <p className="text-sm">Group 2</p>
          <p className="text-sm">Group 3</p>
        </div>
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-4">Your Activity</h2>
          <p className="text-sm">Recent post 1</p>
          <p className="text-sm">Recent post 2</p>
          <p className="text-sm">Recent post 3</p>
        </div>
      </div>
    </aside>
  );
}
