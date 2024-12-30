"use client";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import { AppShell, Avatar, Group, Stack, Text, useMantineTheme, useComputedColorScheme } from "@mantine/core";
import { SignOut } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";

import BottomNavigationBar from "../BottomBar";
import BrandLogo from "../Logo";
import FeedbackButton from "./FeedBack";
import UserProfileCard from "./UserCard";
import NavigationRoutes from "./NavRoutes";

import { dark_theme } from "@/app/config/theme";
import ThemeSwitcher from "./ThemeSwitcher";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkIfAtLeastOneBookIsThere } from "@/appwrite/checkIfAtLeastOneBookIsThere";
import NoContentAdded from "../NoContentAdded";
import PDFUploadModalProvider from "../PDFUploadModalProvider";
import OnSignedOutLayout from "./OnSignedOutLayout";
import CheckDesktopScreen from "./CheckDesktopScreen";
import SharedContent from "@/app/shared/blogs/public/[id]/page";

function AppShellLayout({ children }) {
  const { user } = useUser();
  const imageArray = Array.from({ length: 100 }, (_, i) => `${i + 1}.jpg`);

  function chooseRandomImage() {
    setCurrentImage(`/compress-cats/${imageArray[Math.floor(Math.random() * imageArray.length)]}`);
  }

  const { data: bookLength, isSuccess: isBookLengthSuccess } = useQuery({
    queryKey: ["bookLength"],
    queryFn: () => checkIfAtLeastOneBookIsThere({ user_id: user.id }),
    cacheTime: Infinity,
  });

  // status can be idle, pending, success, error
  const mantineTheme = useMantineTheme();
  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const isCompactScreen = useMediaQuery("(max-width:480px)");
  const isTabletScreen = useMediaQuery("(max-width:767px)");

  const colorScheme = useComputedColorScheme();
  const [isNavbarOpen, { toggle: toggleNavbar }] = useDisclosure();

  const AppShellHeader = memo(() => (
    <AppShell.Header bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}>
      <Group justify="space-between" h="100%" px="md">
        {isTabletScreen && <Avatar src={user?.imageUrl} onClick={toggleNavbar} alt={user?.fullName} size={32} />}
        <BrandLogo />
        {isTabletScreen && <ThemeSwitcher />}
        {!isTabletScreen && <FeedbackButton />}
      </Group>
    </AppShell.Header>
  ));

  AppShellHeader.displayName = "AppShellHeader";

  return (
    <>
      <OnSignedOutLayout>
        <SharedContent />
      </OnSignedOutLayout>
      <SignedIn>
        <PDFUploadModalProvider />
        <AppShell
          bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !isNavbarOpen },
          }}
        >
          <Toaster position="bottom-center" reverseOrder={false} />
          <AppShellHeader />
          <AppShell.Navbar p="md" bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}>
            <Stack gap={0} h="100%" justify="space-between">
              <Stack gap={0}>
                <UserProfileCard
                  colorScheme={colorScheme}
                  fullName={user?.fullName}
                  emailAddress={user?.emailAddresses[0]?.emailAddress}
                  imageUrl={user?.imageUrl}
                  color={colorScheme === "dark" ? "rgb(19, 27, 46)" : mantineTheme.colors.gray[0]}
                />
                <NavigationRoutes toggle={toggleNavbar} colorScheme={colorScheme} />
              </Stack>
              <Group mb={"md"} justify="space-between" gap={0}>
                <SignOutButton>
                  <Group
                    gap="xs"
                    align="center"
                    p="sm"
                    justify="center"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Text size="sm" c={colorScheme === "dark" ? dark_theme.main_text_color : "red"} fontWeight={500}>
                      Sign out
                    </Text>
                    <SignOut
                      weight="bold"
                      color={colorScheme === "dark" ? dark_theme.main_text_color : "#fa5252"}
                      size={16}
                    />
                  </Group>
                </SignOutButton>
                {!isSmallScreen && <ThemeSwitcher />}
                {isSmallScreen && <FeedbackButton />}
              </Group>
            </Stack>
          </AppShell.Navbar>

          {isBookLengthSuccess && bookLength === 0 ? (
            <AppShell.Main style={{ paddingInline: isCompactScreen ? 0 : undefined }}>
              <Stack justify="center" align="center" h={"80vh"}>
                <NoContentAdded />
              </Stack>
            </AppShell.Main>
          ) : (
            <AppShell.Main style={{ paddingInline: isCompactScreen ? 0 : undefined }}>
              <CheckDesktopScreen>{children}</CheckDesktopScreen>
            </AppShell.Main>
          )}
          {/* Bottom Navigation for Small Screens */}
          {isSmallScreen && !isNavbarOpen && <BottomNavigationBar />}
        </AppShell>
      </SignedIn>
    </>
  );
}

export default AppShellLayout;

