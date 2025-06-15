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
  DropdownDivider,
  HR,
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
      setIsLoggingOut(false);
      router.push("/login");
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
      className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4 py-2.5 shadow-md lg:px-6 dark:border-gray-700 dark:bg-gradient-to-r dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900"
      fluid
    >
      <NavbarBrand as={Link} href="/" className="flex items-center">
        <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/icon.png"
            className="transform object-contain transition-transform duration-300 hover:scale-110"
            width={40}
            height={40}
            alt="Quizdom Logo"
          />
        </div>
        <span className="self-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent dark:from-purple-400 dark:to-blue-300">
          Quizdom
        </span>
      </NavbarBrand>

      <div className="flex items-center gap-2 md:order-2">
        <DarkThemeToggle className="cursor-pointer rounded-lg p-2.5 text-gray-600 hover:text-gray-800 focus:ring-4 focus:ring-gray-200 dark:text-gray-300 dark:hover:text-white dark:focus:ring-gray-700" />

        {/* Desktop user info */}
        {isAuthenticated && (
          <div className="mr-2 hidden md:flex md:flex-col md:items-end">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {team?.team || "Team Member"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {team?.school || "Quizdom"}
            </span>
          </div>
        )}

        {/* Desktop Dropdown */}
        {isAuthenticated ? (
          <div className="hidden md:block">
            <Dropdown
              arrowIcon={true}
              label={"Controls"}
              className="cursor-pointer"
            >
              <DropdownHeader>
                <span className="block text-sm font-semibold dark:text-white">
                  {team?.team || "User"}
                </span>
                <span className="block truncate text-sm font-medium dark:text-gray-300">
                  <b>
                    <u>ROLE:</u>
                  </b>{" "}
                  {team?.role || "Member"}
                </span>
              </DropdownHeader>
              <DropdownItem
                as={Link}
                href="/account"
                className="dark:text-gray-200"
              >
                Profile
              </DropdownItem>
              <DropdownItem
                as={Link}
                href={getBuzzerURL()}
                className="dark:text-gray-200"
              >
                Buzzer
              </DropdownItem>
              {team?.role === "ADMIN" && (
                <DropdownItem
                  as={Link}
                  href="/quiz/timer"
                  className="dark:text-gray-200"
                >
                  Timer
                </DropdownItem>
              )}
              <DropdownDivider />
              <DropdownItem
                
                onClick={handleLogOut}
                disabled={isLoggingOut}
                className="dark:text-gray-200"
              >
                {isLoggingOut ? "Logging out..." : "Sign out"}
              </DropdownItem>
            </Dropdown>
          </div>
        ) : null}

        <NavbarToggle className="ml-1 focus:ring-2 focus:ring-blue-300 dark:text-white dark:focus:ring-blue-600" />
      </div>

      <NavbarCollapse className="md:flex md:items-center">
        <div className="flex w-full flex-col md:w-auto md:flex-row md:gap-4 lg:gap-6">
          <NavbarLink
            href="/"
            active={isActive("/")}
            className={`rounded-lg py-2 pr-4 pl-3 text-sm font-medium transition-colors duration-200 md:px-3 md:py-2 ${
              isActive("/")
                ? "bg-blue-100 font-bold text-blue-800 shadow dark:bg-blue-800 dark:text-yellow-300"
                : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            } `}
          >
            Home
          </NavbarLink>
          <NavbarLink
            href="/about"
            active={isActive("/about")}
            className={`rounded-lg py-2 pr-4 pl-3 text-sm font-medium transition-colors duration-200 md:px-3 md:py-2 ${
              isActive("/about")
                ? "bg-blue-100 font-bold text-blue-800 shadow dark:bg-blue-800 dark:text-yellow-300"
                : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            } `}
          >
            About
          </NavbarLink>
          <NavbarLink
            href="/quiz"
            active={isActive("/quiz")}
            className={`rounded-lg py-2 pr-4 pl-3 text-sm font-medium transition-colors duration-200 md:px-3 md:py-2 ${
              isActive("/quiz")
                ? "bg-blue-100 font-bold text-blue-800 shadow dark:bg-blue-800 dark:text-yellow-300"
                : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            } `}
          >
            QNA
          </NavbarLink>
          {/* Mobile Dropdown */}
          <HR />
          {isAuthenticated && (
            <div className="mb-2 block w-full md:hidden">
              <div className="mb-2 flex flex-col items-start px-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {team?.team || "Team Member"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {team?.school || "Quizdom"}
                </span>
              </div>
              <Dropdown
                arrowIcon={true}
                label={"Controls"}
                className="w-full cursor-pointer dark:bg-gray-900"
                style={{ width: "100%" }}
              >
                <DropdownHeader>
                  <span className="block text-sm font-semibold dark:text-white">
                    {team?.team || "User"}
                  </span>
                  <span className="block truncate text-sm font-medium dark:text-gray-300">
                    <b>
                      <u>ROLE:</u>
                    </b>{" "}
                    {team?.role || "Member"}
                  </span>
                </DropdownHeader>
                <DropdownItem
                  as={Link}
                  href="/account"
                  className="dark:text-gray-200"
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  as={Link}
                  href={getBuzzerURL()}
                  className="dark:text-gray-200"
                >
                  Buzzer
                </DropdownItem>
                {team?.role === "ADMIN" && (
                  <DropdownItem
                    as={Link}
                    href="/quiz/timer"
                    className="dark:text-gray-200"
                  >
                    Timer
                  </DropdownItem>
                )}
              </Dropdown>
              <HR />
            </div>
          )}
          {isAuthenticated ? (
            <div className="mt-2 md:hidden">
              <Button
                onClick={handleLogOut}
                disabled={isLoggingOut}
                color="red"
                className="w-full rounded-lg px-5 py-2.5 text-sm font-medium"
              >
                {isLoggingOut ? "Logging out..." : "Sign out"}
              </Button>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-2 md:mt-0 md:ml-auto md:flex-row">
              <Button
                as={Link}
                href="/login"
                color="light"
                className="w-full cursor-pointer rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 md:w-auto dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 md:w-auto dark:focus:ring-blue-800"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
