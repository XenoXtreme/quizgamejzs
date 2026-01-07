"use client";
// REACT
import * as React from "react";

// NEXTJS
import { redirect } from "next/navigation";

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ICONS
import { Copy, Loader2 } from "lucide-react";

// CONTEXT
import { useAuthContext } from "@/context/auth/state";
import { type RegistrationModel } from "@/context/auth/context";

// UUID
import { v4 } from "uuid";

// TOAST
import { toast } from "sonner";

export default function Home() {
  // TYPES

  const InitialState: RegistrationModel = {
    team: "",
    password: v4(),
    category: "Interschool (Senior)",
    members: {
      member1: { name: "", class: "IX" },
      member2: { name: "", class: "IX" },
      member3: { name: "", class: "IX" },
      member4: { name: "", class: "IX" },
    },
    role: "Team",
    school: "",
  };

  // USESTATE DEFINITION
  const [data, setData] = React.useState<RegistrationModel>(InitialState);
  const [loading, setLoading] = React.useState<boolean>(false);

  // INPUT AND SELECT CHANGE HANDLER
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, name, value } = e.target;
    const [memberKey, field] = name.split(".");
    if (memberKey.includes("member") && memberKey && field) {
      setData((prevState) => ({
        ...prevState,
        members: {
          ...prevState.members,
          [memberKey]: {
            ...prevState.members[memberKey as keyof typeof prevState.members],
            [field]: value,
          },
        },
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  }

  function handleSelectChange(name: string, value: string) {
    const [memberKey, field] = name.split(".");
    if (memberKey.includes("member") && memberKey && field) {
      setData((prevState) => ({
        ...prevState,
        members: {
          ...prevState.members,
          [memberKey]: {
            ...prevState.members[memberKey as keyof typeof prevState.members],
            [field]: value,
          },
        },
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  // COPY TO CLIPBOARD
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // BUTTON VALIDATION
  function valiDateButton(): boolean {
    if (loading) {
      return Boolean(loading);
    } else {
      return (
        Object.values(data.members).every(
          (member) =>
            (member?.name?.length ?? 0) < 6 && (member?.class?.length ?? 0) < 1
        ) || [data.school].some((field) => (field?.length ?? 0) < 6)
      );
    }
  }

  const verified = valiDateButton();

  // CONTEXT AND AUTH
  const { register } = useAuthContext();

  async function handleRegister(e: React.SyntheticEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    await register(data)
      .then((res) => {
        if (res.response?.data?.id) {
          localStorage.setItem("_user", JSON.stringify(res.response?.data));
          localStorage.setItem("_token", JSON.stringify(res.response?.token));
          toast.success(
            `Successfully created account. ID: ${res.response?.data?.id}`,
            {
              duration: 3000,
            }
          );
          setLoading(false);
          setTimeout(() => {
            toast.info("Log in to your account.", { duration: 900 });
            redirect("/login");
          }, 3500);
        } else {
          toast.error("Failed to login.", { duration: 1000 });
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("Failed to login.", { duration: 1000 });
        setLoading(false);
      });
  }

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("_user")) {
        toast.info("You are authenticated.");
        redirect("/account");
      }
    }
  });

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="mx-auto w-full">
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-600 sm:mb-8 sm:text-4xl dark:text-blue-400">
          Team Registration
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-blue-400 sm:w-20 dark:bg-blue-600" />
        </h1>

        {/* Password Field */}
        <div className="relative mb-6 sm:mb-8">
          <Label
            htmlFor="password"
            className="mb-2 block text-base font-semibold text-gray-700 sm:text-lg dark:text-gray-300"
          >
            Team Password
          </Label>
          <div className="flex gap-2">
            <Input
              id="password"
              type="text"
              value={data?.password as string}
              className="w-full font-mono text-base sm:text-lg"
              disabled
            />
            <Button
              type="button"
              size="icon"
              variant="default"
              className="shrink-0 cursor-pointer"
              onClick={() => copyToClipboard(data?.password as string)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Save this password for future login
          </p>
        </div>

        {/* Team Members Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 sm:text-xl dark:text-gray-300">
                Member {num}
              </h3>
              <div>
                <Label
                  htmlFor={`_M${num}N`}
                  className="mb-2 block text-gray-600 dark:text-gray-400"
                >
                  Full Name
                </Label>
                <Input
                  id={`_M${num}N`}
                  name={`member${num}.name`}
                  type="text"
                  placeholder={`Member ${num} name`}
                  value={
                    data?.members[`member${num}` as keyof typeof data.members]
                      .name as string
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor={`_M${num}C`}
                  className="mb-2 block text-gray-600 dark:text-gray-400"
                >
                  Class
                </Label>
                <Select
                  value={
                    data?.members[`member${num}` as keyof typeof data.members]
                      .class
                  }
                  onValueChange={(value) =>
                    handleSelectChange(`member${num}.class`, value)
                  }
                >
                  <SelectTrigger id={`_M${num}C`} className="cursor-pointer">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {["IX", "X", "XI", "XII"].map((cls) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={cls}
                        value={cls}
                      >
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        {/* Team Details Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 md:grid-cols-3">
          <div>
            <Label
              htmlFor="category"
              className="mb-2 block text-base font-semibold text-gray-700 sm:text-lg dark:text-gray-300"
            >
              Competition Category
            </Label>
            <Select
              value={data?.category as string}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category" className="w-full cursor-pointer">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {["Interschool (Senior)"].map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="team"
              className="mb-2 block text-base font-semibold text-gray-700 sm:text-lg dark:text-gray-300"
            >
              Team Name
            </Label>
            <Input
              id="team"
              placeholder="Enter your team name"
              value={data?.team as string}
              onChange={handleChange}
              className="w-full text-base sm:text-lg"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="school"
              className="mb-2 block text-base font-semibold text-gray-700 sm:text-lg dark:text-gray-300"
            >
              School Name
            </Label>
            <Input
              id="school"
              type="text"
              placeholder="Your school's name"
              value={data?.school as string}
              onChange={handleChange}
              className="w-full text-base sm:text-lg"
              required
            />
          </div>
        </div>

        <Button
          className="w-full text-base font-semibold sm:text-lg cursor-pointer"
          onClick={handleRegister}
          disabled={verified}
          size="lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Registering...
            </span>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </div>
  );
}
