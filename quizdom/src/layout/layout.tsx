"use client";
// REACT
import * as React from "react";

// FLOWBITE
import { ThemeProvider, useThemeMode } from "flowbite-react";

// TOAST
import { Toaster, type ToasterProps } from "sonner";

// CONTEXT
import { AuthState } from "@/context/auth/state";

// COMPONENTS
import Navbar from "@/components/panel/navbar";
import Footer from "@/components/panel/footer";
import Loader from "@/components/panel/loader/loader";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { computedMode } = useThemeMode();
  // Loading State
  const [PageLoading, setPageLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window.document !== "undefined") {
      setPageLoading(false);
    }
  }, [PageLoading]);

  return PageLoading ? (
    <Loader />
  ) : (
    <AuthState>
      <ThemeProvider>
        <Toaster
          expand
          visibleToasts={9}
          hotkey={["alt + T"]}
          closeButton
          richColors={true}
          position="top-right"
          theme={computedMode as ToasterProps["theme"]}
          duration={3500}
        />
        <Navbar />
        {children}
        <Footer />
      </ThemeProvider>
    </AuthState>
  );
}
