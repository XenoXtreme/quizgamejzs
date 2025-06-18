"use client";
// REACT
import * as React from "react";

// NEXTJS
import { redirect } from "next/navigation";

// FLOWBITE
import {
  Button,
  ClipboardWithIcon,
  Label,
  TextInput,
  Select,
} from "flowbite-react";

// CONTEXT
import { useAuthContext } from "@/context/auth/state";

// UUID
import { v4 } from "uuid";

// TOAST
import { toast } from "sonner";
import { styleText } from "util";

export default function Home() {
  // TYPES
  interface Member {
    name: string | undefined | null;
    class: string | undefined;
  }

  interface Team {
    password: string | undefined | null;
    team: string | undefined | null;
    category: string | undefined | null;
    school: string | undefined | null;
    role: string | null;
    members: {
      member1: Member;
      member2: Member;
      member3: Member;
      member4: Member;
    };
  }
  const InitialState: Team = {
    team: "",
    password: v4(),
    category: "Intraschool (Junior)",
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
  const [data, setData] = React.useState<Team>(InitialState);
  const [loading, setLoading] = React.useState<Boolean>(false);

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
  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const { id, name, value } = e.currentTarget;
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

  // BUTTON VALIDATION
  function valiDateButton(): boolean {
    if (loading) {
      return Boolean(loading);
    } else {
      return (
        Object.values(data.members).every(
          (member) =>
            (member?.name?.length ?? 0) < 6 && (member?.class?.length ?? 0) < 1,
        ) || [data.school].some((field) => (field?.length ?? 0) < 6)
      );
    }
  }

  const verified = valiDateButton();

  // CONTEXT AND AUH
  const { register } = useAuthContext();

  async function handleRegister(e: React.SyntheticEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    await register(data)
      .then((res) => {
        if (res.id) {
          navigator.clipboard.writeText(res.id);
          toast.success(`Successfully created account. ID: ${res.id}`, {
            duration: 6000,
          });
          setLoading(false);
          setTimeout(() => {
            toast.info("Log in to your account.", { duration: 700 });
            redirect("/login");
          }, 3000);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 dark:from-gray-900 dark:to-gray-800">
      <form className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl transition-all duration-300 hover:shadow-2xl sm:max-w-2xl sm:p-8 md:p-12 dark:bg-gray-800">
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
            <TextInput
              id="password"
              type="text"
              value={data?.password as string}
              className="w-full py-2.5 font-mono text-base sm:text-lg"
              disabled
            />
            <ClipboardWithIcon
              className="cursor-pointer rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
              valueToCopy={data?.password as string}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Save this password for future login
          </p>
        </div>

        {/* Team Members Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6">
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
                <TextInput
                  id={`_M${num}N`}
                  name={`member${num}.name`}
                  type="text"
                  placeholder={`Member ${num} name`}
                  value={
                    data?.members[`member${num}` as keyof typeof data.members]
                      .name as string
                  }
                  onChange={handleChange}
                  className="focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
                  id={`_M${num}C`}
                  name={`member${num}.class`}
                  value={
                    data?.members[`member${num}` as keyof typeof data.members]
                      .class
                  }
                  onChange={handleSelect}
                  className="w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {["IX", "X", "XI", "XII"].map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ))}
        </div>

        {/* Team Details Section */}
        <div className="mb-6 space-y-4 sm:mb-8 sm:space-y-6">
          <div>
            <Label
              htmlFor="category"
              className="mb-2 block text-base font-semibold text-gray-700 sm:text-lg dark:text-gray-300"
            >
              Competition Category
            </Label>
            <Select
              id="category"
              value={data?.category as string}
              onChange={handleSelect}
              className="w-full py-2.5 text-base focus:ring-2 focus:ring-blue-500 sm:text-lg"
              required
            >
              {[
                "Intraschool (Junior)",
                "Intraschool (Senior)",
                "Interschool (Senior)",
              ].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label
              htmlFor="team"
              className="mb-2 block text-base font-semibold text-gray-700 sm:text-lg dark:text-gray-300"
            >
              Team Name
            </Label>
            <TextInput
              id="team"
              placeholder="Enter your team name"
              value={data?.team as string}
              onChange={handleChange}
              className="w-full py-2.5 text-base focus:ring-2 focus:ring-blue-500 sm:text-lg"
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
            <TextInput
              id="school"
              type="text"
              placeholder="Your school's name"
              value={data?.school as string}
              onChange={handleChange}
              className="w-full py-2.5 text-base focus:ring-2 focus:ring-blue-500 sm:text-lg"
              required
            />
          </div>
        </div>

        <Button
          className="w-full cursor-pointer rounded-lg py-3 text-base font-semibold transition-transform hover:scale-105 sm:text-lg"
          onClick={handleRegister}
          disabled={verified}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="mr-3 h-5 w-5 animate-spin ..."
                viewBox="0 0 24 24"
              >
                {/* Loading spinner SVG */}
              </svg>
              Registering...
            </span>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </form>
    </div>
  );
}
