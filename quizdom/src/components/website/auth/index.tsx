"use client";
// REACT
import * as React from "react";

// NEXT
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// SHADCN/UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ICONS
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

// CONTEXT
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";

// TOAST
import { toast } from "sonner";

export default function Home() {
  interface LoginData {
    _id: string | null;
    _t_password: string | null;
  }

  const loginInitialState: LoginData = {
    _id: "",
    _t_password: "",
  };

  const router = useRouter();

  // USESTATE DEFINITION
  const [data, setData] = React.useState<LoginData>(loginInitialState);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  // INPUT AND SELECT CHANGE HANDLER
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  // BUTTON VALIDATION
  function validateButton(): boolean {
    if (loading) {
      return true;
    } else {
      return [data._id, data._t_password].some(
        (field) => (field?.length ?? 0) < 6
      );
    }
  }

  const isButtonDisabled = validateButton();

  // CONTEXT AND AUTH
  const context = useAuthContext();
  const { login }: ContextType = context;

  async function handleLogin(e: React.SyntheticEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);
    await login(data._id, data._t_password)
      .then((res) => {
        if (res.response?.data?.id) {
          localStorage.setItem("_user", JSON.stringify(res.response?.data));
          localStorage.setItem("_token", JSON.stringify(res.response?.token));
          toast.success("Successfully logged in.", { duration: 600 });
          setLoading(false);
          router.push("/account");
        } else {
          toast.error("Failed to login.", { duration: 600 });
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error("Failed to login.", { duration: 1500 });
        console.log(error);
        setLoading(false);
      });
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  React.useEffect(() => {
    if (localStorage?.getItem("_user")) {
      router.push("/account");
      toast.warning("Already logged in.", { duration: 600 });
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-2 py-8 sm:px-4 sm:py-12 dark:bg-gray-900">
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="animate-blob absolute top-0 -left-4 h-44 w-44 rounded-full bg-purple-300 mix-blend-multiply blur-3xl filter sm:h-72 sm:w-72"></div>
        <div className="animate-blob animation-delay-2000 absolute top-0 -right-4 h-44 w-44 rounded-full bg-yellow-300 mix-blend-multiply blur-3xl filter sm:h-72 sm:w-72"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-10 h-44 w-44 rounded-full bg-pink-300 mix-blend-multiply blur-3xl filter sm:left-20 sm:h-72 sm:w-72"></div>
      </div>

      <Card className="z-10 w-full max-w-xs border bg-white shadow-xl sm:max-w-md dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-2 flex justify-center">
            <div className="relative h-12 w-12 sm:h-16 sm:w-16">
              <Image
                src="/icon.png"
                alt="Quizdom Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl dark:from-purple-400 dark:to-blue-300">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-xs sm:text-base">
            Sign in to your Quizdom account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="_id"
                className="text-sm text-gray-700 sm:text-base dark:text-gray-300"
              >
                Team ID
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  id="_id"
                  type="text"
                  autoComplete="teamID"
                  placeholder="Enter your team ID"
                  value={data._id as string}
                  onChange={handleChange}
                  required
                  className="pl-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="_t_password"
                className="text-sm text-gray-700 sm:text-base dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  id="_t_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="password"
                  value={data._t_password as string}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isButtonDisabled}
              className="mt-2 cursor-pointer bg-linear-to-r from-blue-600 to-purple-600 font-medium text-white hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="mt-2 text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Register now
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
