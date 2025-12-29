// FLOWBITE
import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
  FooterIcon
} from "flowbite-react";
 
export default function AppFooter() {
  const date = new Date();

  return (
    <Footer
      container
      className="bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-none border-t border-gray-200 dark:border-gray-700 shadow-inner transition-colors duration-300"
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand Section */}
          <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
            <FooterBrand
              href="/"
              src="/icon.png"
              alt="Quizdom Logo"
              name="Quizdom"
              className="!text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight"
            />
            <span className="mt-2 text-sm text-gray-400 dark:text-gray-400/80 hidden md:block">
              Your daily dose of quizzes!
            </span>
          </div>

          {/* Navigation Links */}
          <FooterLinkGroup className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
            <FooterLink
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors text-lg font-medium px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Home
            </FooterLink>
            <FooterLink
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors text-lg font-medium px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              About
            </FooterLink>
            <FooterLink
              href="/quiz"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors text-lg font-medium px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Q&A
            </FooterLink>
          </FooterLinkGroup>
        </div>

        <FooterDivider className="my-8 border-gray-200 dark:border-gray-700 transition-colors" />

        <FooterCopyright
          by="Quizdom"
          year={date.getFullYear()}
          href="/"
          className="text-gray-500 dark:text-gray-400 text-center w-full text-base transition-colors"
        />
      </div>
    </Footer>
  );
}