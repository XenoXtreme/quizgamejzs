"use client";
// REACT
import * as React from "react";

// NEXT
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// FLOWBITE
import {
  Button,
  Label,
  TextInput,
  Card,
  Spinner,
} from "flowbite-react";

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
        if (res["id"]) {
          localStorage.setItem("_user", JSON.stringify(res));
          toast.success("Successfully logged in.", {duration: 1500});
          setLoading(false);
          router.push("/account");
        } else {
          toast.error("Failed to login.", {duration: 1500});
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("Failed to login.", {duration: 1500});
        setLoading(false);
      });
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  React.useEffect(()=>{
    if(localStorage?.getItem("_user")){
      router.push("/account")
      toast.warning("Already logged in.", {duration: 600})
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-8 sm:py-12">
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-0 -left-4 w-44 sm:w-72 h-44 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-44 sm:w-72 h-44 sm:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-10 sm:left-20 w-44 sm:w-72 h-44 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <Card className="w-full max-w-xs sm:max-w-md shadow-xl border dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
        <div className="flex flex-col items-center mb-4">
          <div className="relative h-12 w-12 sm:h-16 sm:w-16 mb-2">
            <Image
              src="/icon.png"
              alt="Quizdom Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-1 text-xs sm:text-base">
            Sign in to your Quizdom account
          </p>
        </div>
        
        <form className="flex flex-col gap-3 sm:gap-4">
          <div>
            <div className="mb-2 flex justify-between">
              <Label htmlFor="_id" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Team ID</Label>
            </div>
            <TextInput
              id="_id"
              type="text"
              placeholder="Enter your team ID"
              value={data._id as string}
              onChange={handleChange}
              required
              className="focus:ring-2 focus:ring-blue-500"
              icon={() => (
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              )}
            />
          </div>
          
          <div>
            <div className="relative">
              <TextInput
                id="_t_password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={data._t_password as string}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-blue-500"
                icon={() => (
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                )}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <Button
            onClick={handleLogin}
            disabled={isButtonDisabled}
            className="cursor-pointer mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-white"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          
          <div className="text-xs sm:text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
              Register now
            </Link>
          </div>
        </form>   
      </Card>
    </div>
  );
}