import { useEffect, useState } from "react";
// NEXTJS
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// CONTEXT
import { useAuthContext } from "@/context/auth/state";
import { Team, ContextType } from "@/context/auth/context";
// TOAST
import { toast } from "sonner";
// FLOWBITE
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
  Button,
  Dropdown,
  DropdownItem,
  DropdownHeader,
  DropdownDivider
} from "flowbite-react";

export default function AppBar() {
  const path = usePathname();
  const router = useRouter();
  const { team, isAuthenticated, getSetTeam }: ContextType = useAuthContext();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogOut = () => {
    setIsLoggingOut(true);

    // Clear local storage
    localStorage.removeItem("_id");
    localStorage.removeItem("_user");

    toast.success("Successfully logged out.");

    setTimeout(() => {
      router.push("/login")
    }, 2000);
  };

  useEffect(() => {
    // Load user data from localStorage if not already in context
    if (typeof window !== "undefined" && !team?.id) {
      const userJSON = localStorage.getItem("_user");

      if (userJSON) {
        try {
          const userData = JSON.parse(userJSON);

          if (userData) {
            const userTeam: Team = {
              id: userData.id,
              team: userData.team,
              category: userData.category,
              member: userData.members?.[0] || {},
              role: userData.role,
              school: userData.school,
            };

            getSetTeam(userTeam);
          }
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          // Clear potentially corrupted data
          localStorage.removeItem("_user");
        }
      }
    }
  }, [team?.id, getSetTeam]);

  // Fixed isActive function to properly check exact routes
  const isActive = (route: string): boolean => {
    if (route === "/") {
      return path === "/";
    }

    // For other routes, check if path exactly matches or starts with route/
    return path === route || path?.startsWith(`${route}/`);
  };

  // Get Buzzer URL
  function getBuzzerURL() {
    let buzzerURL: string;
    buzzerURL = "/quiz/buzzer";
    if (team.role === "ADMIN") {
      buzzerURL = `/quiz/buzzer?admin=true`;
    }
    return buzzerURL;
  }

  return (
    <Navbar
      className="sticky top-0 z-50 px-4 lg:px-6 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gradient-to-r dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900 shadow-md"
      fluid
    >
      <NavbarBrand as={Link} href="/" className="flex items-center">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg mr-3 shadow-lg">
          <Image
            src="/icon.png"
            className="object-contain transform hover:scale-110 transition-transform duration-300"
            width={40}
            height={40}
            alt="Quizdom Logo"
          />
        </div>
        <span className="self-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300">
          Quizdom
        </span>
      </NavbarBrand>

      <div className="flex items-center md:order-2 gap-2">
        <DarkThemeToggle className="cursor-pointer p-2.5 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg" />

        {isAuthenticated && (
          <div className="hidden md:flex md:flex-col md:items-end mr-2 cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {team?.team || "Team Member"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {team?.school || "Quizdom"}
            </span>
          </div>
        )}

        {isAuthenticated ? (
          <Dropdown
            arrowIcon={true}
            inline
            label={"Controls"}
            className="cursor-pointer"
          >
            <DropdownHeader>
              <span className="block text-sm font-semibold">
                {team?.team || "User"}
              </span>
              <span className="block truncate text-sm font-medium">
                <b><u>ROLE:</u></b> {team?.role || "Member"}
              </span>
            </DropdownHeader>
            <DropdownItem as={Link} href="/account">Profile</DropdownItem>
            <DropdownItem as={Link} href={getBuzzerURL()}>Buzzer</DropdownItem>
            {team?.role === "ADMIN" && (
              <DropdownItem as={Link} href="/timer">
                Timer
              </DropdownItem>
            )}
            <DropdownDivider />
            <DropdownItem onClick={handleLogOut} disabled={isLoggingOut}>
              {isLoggingOut ? "Logging out..." : "Sign out"}
            </DropdownItem>
          </Dropdown>
        ) : null}

        <NavbarToggle className="ml-1 dark:text-white focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600" />
      </div>

      <NavbarCollapse className="md:flex md:items-center">
        <div className="flex flex-col md:flex-row w-full md:w-auto md:gap-4 lg:gap-6">
          <NavbarLink
            href="/"
            active={isActive("/")}
            className={`py-2 pl-3 pr-4 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-colors duration-200
              ${isActive("/") 
                ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-yellow-300 font-bold shadow"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white text-gray-700"}
            `}
          >
            Home
          </NavbarLink>
          <NavbarLink
            href="/about"
            active={isActive("/about")}
            className={`py-2 pl-3 pr-4 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-colors duration-200
              ${isActive("/about") 
                ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-yellow-300 font-bold shadow"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white text-gray-700"}
            `}
          >
            About
          </NavbarLink>
          <NavbarLink
            href="/quiz"
            active={isActive("/quiz")}
            className={`py-2 pl-3 pr-4 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-colors duration-200
              ${isActive("/quiz") 
                ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-yellow-300 font-bold shadow"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white text-gray-700"}
            `}
          >
            QNA
          </NavbarLink>

          {!isAuthenticated ? (
            <div className="flex flex-col md:flex-row md:ml-auto gap-2 mt-2 md:mt-0">
              <Button
                as={Link}
                href="/login"
                color="light"
                className="cursor-pointer w-full md:w-auto text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                className="cursor-pointer w-full md:w-auto text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:focus:ring-blue-800"
              >
                Register
              </Button>
            </div>
          ) : (
            <div className="md:hidden mt-2">
              <Button
                onClick={handleLogOut}
                disabled={isLoggingOut}
                color="failure"
                className="cursor-pointer w-full text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {isLoggingOut ? "Logging out..." : "Sign out"}
              </Button>
            </div>
          )}
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}