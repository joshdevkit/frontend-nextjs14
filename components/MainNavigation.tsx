import { MessageCircleHeartIcon } from "lucide-react";
import Link from "next/link";

const navlinks = [
  {
    title: "Profile",
    url: "/profile",
  },
  {
    title: "Messenger",
    url: "/messenger",
  },
];

export default function MainNavigation() {
  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <div className="flex items-center gap-8">
        <Link href="/dashboard">
          <MessageCircleHeartIcon
            className="text-neutral-950 dark:text-blue-400 
          w-8 h-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
          transition-transform transform hover:scale-105"
          />
        </Link>
        <nav className="flex items-center gap-3 lg:gap-4">
          {navlinks.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="text-neutral-900 hover:text-blue-600 dark:text-white 
              dark:hover:text-blue-400 transition-colors duration-300 transform 
              hover:scale-105 font-medium relative group"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
