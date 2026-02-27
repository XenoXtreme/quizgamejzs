import Link from "next/link";
import Image from "next/image";

export default function AppFooter() {
  const date = new Date();

  return (
    <footer className="border-t border-gray-200 bg-linear-to-t from-gray-100 to-gray-50 shadow-inner transition-colors duration-300 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand Section */}
          <div className="mb-4 flex flex-col items-center md:mb-0 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Quizdom Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-white">
                Quizdom
              </span>
            </Link>
            <span className="mt-2 hidden text-sm text-gray-400 dark:text-gray-400/80 md:block">
              Your daily dose of quizzes!
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
            <Link
              href="/"
              className="rounded px-2 py-1 text-lg font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="rounded px-2 py-1 text-lg font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
            >
              About
            </Link>
            <Link
              href="/quiz"
              className="rounded px-2 py-1 text-lg font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
            >
              Q&A
            </Link>
          </nav>
        </div>

        <div className="my-8 border-t border-gray-200 transition-colors dark:border-gray-700" />

        <div className="w-full text-center text-base text-gray-500 transition-colors dark:text-gray-400">
          © {date.getFullYear()}{" "}
          <Link href="/" className="hover:underline">
            Quizdom
          </Link>
          . All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
