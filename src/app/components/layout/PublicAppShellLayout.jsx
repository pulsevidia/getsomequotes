import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { SignInButton } from "@clerk/nextjs";
import { AppShell, Avatar, Group, Stack, Text, useMantineTheme, useComputedColorScheme } from "@mantine/core";
import { SignIn, SignOut } from "@phosphor-icons/react";

import BrandLogo from "../Logo";
import FeedbackButton from "./FeedBack";

import { dark_theme } from "@/app/config/theme";
import ThemeSwitcher from "./ThemeSwitcher";
import { memo } from "react";

function PublicAppShellLayout({ children }) {
  // status can be idle, pending, success, error
  const mantineTheme = useMantineTheme();
  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const isCompactScreen = useMediaQuery("(max-width:480px)");
  const isTabletScreen = useMediaQuery("(max-width:767px)");

  const colorScheme = useComputedColorScheme();

  const AppShellHeader = memo(() => (
    <AppShell.Header bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}>
      <Group justify="space-between" h="100%" px="md">
        <BrandLogo />
        <ThemeSwitcher />
      </Group>
    </AppShell.Header>
  ));

  AppShellHeader.displayName = "AppShellHeader";

  return (
    <AppShell
      bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}
      padding="md"
      header={{ height: 60 }}
    >
      <AppShellHeader />
    </AppShell>
  );
}

export default PublicAppShellLayout;
