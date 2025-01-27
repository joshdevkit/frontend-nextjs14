import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignJustify, MessageCircleHeartIcon } from "lucide-react";
import Link from "next/link";

const navLinks = [
  {
    title: "Profile",
    url: "/profile",
  },
  {
    title: "Messenger",
    url: "/messenger",
  },
];

export default function MobileNavigation() {
  return (
    <div className="md:hidden overflow-hidden">
      <Sheet>
        <SheetTrigger>
          <AlignJustify />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <Link href="/dashboard">
            <MessageCircleHeartIcon className="text-red-500" />
          </Link>
          <nav className="flex flex-col items-left gap-3 mt-6 lg:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.url}
                className="text-neutral-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-105 font-medium relative group"
              >
                {link.title}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 scale-x-0 transform transition-all duration-300 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
