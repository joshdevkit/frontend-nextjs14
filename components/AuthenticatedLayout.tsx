import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import MainNavigation from "./MainNavigation";
import MobileNavigation from "./MobileNavigation";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import http from "@/lib/utils";
import { clearToken, clearUser, getToken, getUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};
const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const user = useSelector(getUser);

  useEffect(() => {
    if (!token && !user) {
      router.push("/login");
    }
  }, [token, user, router]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    try {
      await http.post("/auth/logout");
      dispatch(clearToken());
      dispatch(clearUser());
      router.push("/login");
    } catch (error: any) {
      toast.warning(error);
    }
  };

  return (
    <>
      <header
        className="w-full text-gray-800 dark:text-gray-200 
        bg-white/30 dark:bg-gray-950/30 
        backdrop-blur-md 
        z-10 
        "
      >
        <div className="h-16 container flex items-center">
          <MainNavigation />
          <MobileNavigation />
          <h1
            className="text-3xl font-bold text-transparent bg-clip-text 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex 
          items-center justify-end flex-1"
          >
            PostHive
          </h1>
          <div className="relative flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative inline-block">
                  <Avatar className="cursor-pointer ml-3 text-black">
                    <AvatarFallback className="font-bold uppercase">
                      <p className="dark:text-gray-100">
                        {user?.name
                          ? user?.name
                              .split(" ")
                              .map((word: string) => word[0])
                              .join("")
                              .toUpperCase()
                          : "?"}{" "}
                      </p>
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/user/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/user/change-password")}
                >
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative flex items-center ml-4">
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                <Moon
                  className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
                    theme === "light"
                      ? "rotate-0 scale-100"
                      : "rotate-90 scale-0"
                  }`}
                />
                <Sun
                  className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
                    theme === "light"
                      ? "rotate-0 scale-0"
                      : "rotate-0 scale-100"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div>{children}</div>
    </>
  );
};

export default AuthenticatedLayout;
