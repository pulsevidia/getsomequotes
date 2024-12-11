"use client";

import { SignedOut, SignInButton } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";
import PublicAppShellLayout from "./PublicAppShellLayout";

function OnSignedOutLayout({ children }) {
  const pathname = usePathname();
  return (
    <SignedOut>
      {pathname.includes("shared/blogs/public") ? (
        <PublicAppShellLayout>{children}</PublicAppShellLayout>
      ) : (
        <SignInButton />
      )}
    </SignedOut>
  );
}
export default OnSignedOutLayout;
