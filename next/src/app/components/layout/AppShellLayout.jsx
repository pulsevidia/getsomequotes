import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import { AppShell, Avatar, Group, Stack, Text, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { SignOut } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";

import BottomNavigationBar from "../BottomBar";
import BrandLogo from "../Logo";
import SignInPrompt from "../NotSignedIn";
import FeedbackButton from "./FeedBack";
import UserProfileCard from "./UserCard";
import NavigationRoutes from "./NavRoutes";

import { dark_theme } from "@/app/config/theme";
import ThemeSwitcher from "./ThemeSwitcher";

function AppShellLayout({ children }) {
  const mantineTheme = useMantineTheme();
  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const isCompactScreen = useMediaQuery("(max-width:480px)");
  const isTabletScreen = useMediaQuery("(max-width:767px)");

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

          {/* Main Content */}
          <AppShell.Main style={{ paddingInline: isCompactScreen ? 0 : undefined }}>{children}</AppShell.Main>

          {/* Bottom Navigation for Small Screens */}
          {isSmallScreen && !isNavbarOpen && <BottomNavigationBar />}
        </AppShell>
      </SignedIn>
    </>
  );
}

export default AppShellLayout;
