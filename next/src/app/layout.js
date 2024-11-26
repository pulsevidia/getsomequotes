"use client";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "./globals.css";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { SunDim, Moon, SignOut } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import BottomNavigationBar from "./components/BottomBar";
import BrandLogo from "./components/Logo";
import SignInPrompt from "./components/NotSignedIn";
import { cardShadows } from "./utils/shadows";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AppShell,
  Avatar,
  Center,
  closeOnEscape,
  createTheme,
  Group,
  MantineProvider,
  SegmentedControl,
  Stack,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { ClerkProvider, SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import { dark_theme } from "./config/theme";
import FeedbackButton from "./components/layout/FeedBack";
import UserProfileCard from "./components/layout/UserCard";
import NavigationRoutes from "./components/layout/NavRoutes";

// Theme Toggle Button Component
const ThemeSwitcher = () => {
  const colorScheme = useComputedColorScheme();
  const [themeMode, setThemeMode] = useState(colorScheme);
  const { setColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      radius="xl"
      size="xs"
      onChange={(selectedValue) => {
        setThemeMode(selectedValue);
        setColorScheme(selectedValue);
      }}
      bg={colorScheme === "dark" ? "rgb(11, 09, 28)" : undefined}
      value={themeMode}
      withItemsBorders={false}
      w={66}
      styles={{
        indicator: {
          background: colorScheme === "dark" && "rgb(19, 27, 46)",
          boxShadow: cardShadows.md,
        },
        label: { padding: "calc(0.375rem) calc(0.375rem)" },
      }}
      data={[
        {
          value: "light",
          label: (
            <Center>
              <SunDim
                c={
                  colorScheme === "dark"
                    ? themeMode === "light"
                      ? dark_theme.main_text_color
                      : dark_theme.secondary_text_color
                    : undefined
                }
                size={16}
              />
            </Center>
          ),
        },
        {
          value: "dark",
          label: (
            <Center p={0}>
              <Moon
                color={
                  colorScheme === "dark"
                    ? themeMode === "dark"
                      ? dark_theme.main_text_color
                      : dark_theme.secondary_text_color
                    : undefined
                }
                size={16}
              />
            </Center>
          ),
        },
      ]}
    />
  );
};

// Application Shell
function AppShellLayout({ children }) {
  const router = useRouter();
  const currentPath = usePathname();
  const isBlogView = currentPath.includes("/blog/");

  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const isCompactScreen = useMediaQuery("(max-width:480px)");
  const isTabletScreen = useMediaQuery("(max-width:767px)");

  const mantineTheme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const [isNavbarOpen, { toggle: toggleNavbar }] = useDisclosure();
  const { user } = useUser();

  return (
    <>
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
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

          {/* Header */}
          <AppShell.Header bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}>
            <Group justify="space-between" h="100%" px="md">
              {isTabletScreen && <Avatar src={user?.imageUrl} onClick={toggleNavbar} alt={user?.fullName} size={32} />}
              <BrandLogo />
              {isTabletScreen && <ThemeSwitcher />}
              {!isTabletScreen && <FeedbackButton />}
            </Group>
          </AppShell.Header>

          {/* Navbar */}
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
                <NavigationRoutes
                  router={router}
                  toggle={toggleNavbar}
                  pathname={currentPath}
                  colorScheme={colorScheme}
                />
              </Stack>
              <Group justify="space-between" gap={0}>
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

          {/* Main Content */}
          <AppShell.Main style={{ paddingInline: isCompactScreen ? 0 : undefined }}>{children}</AppShell.Main>

          {/* Bottom Navigation for Small Screens */}
          {isSmallScreen && !isBlogView && !isNavbarOpen && <BottomNavigationBar />}
        </AppShell>
      </SignedIn>
    </>
  );
}

// Root Layout Component
function RootLayout({ children }) {
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    if (currentPath === "/") router.push("/home");
  }, [currentPath, router]);

  const defaultTheme = createTheme({
    fontFamily: "Verdana, sans-serif",
    fontFamilyMonospace: "Monaco, Courier, monospace",
    headings: { fontFamily: "Greycliff CF, sans-serif" },
  });

  const queryClient = new QueryClient();

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <head>
            <meta name="twitter:image" content="twitter-image.png" />
            <meta name="twitter:image:type" content="image/png" />
            <meta name="twitter:image:width" content="1200" />
            <meta name="twitter:image:height" content="630" />
            <meta property="og:image" content="opengraph-image.png" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="description" content="Turn your favorite books into short blogs without losing exact lines." />
            <title>Purple Night</title>
          </head>
          <body>
            <MantineProvider theme={defaultTheme} defaultColorScheme="light">
              <AppShellLayout>{children}</AppShellLayout>
            </MantineProvider>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default RootLayout;
