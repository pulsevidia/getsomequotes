import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "./globals.css";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { House, UploadSimple, FilePlus, SunDim, Moon, SignOut } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";
import BottomBar from "./components/BottomBar";
import Logo from "./components/Logo";
import NotSignedIn from "./components/NotSignedIn";
import { cardShadows } from "./utils/shadows";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AppShell,
  Avatar,
  Card,
  Center,
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
import FeedBack from "./components/layout/FeedBack";

// Theme Toggle Button
const ThemeToggleButton = () => {
  const colorScheme = useComputedColorScheme();
  const [value, setValue] = useState(colorScheme);
  const { setColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      radius={"xl"}
      size="xs"
      onChange={(val) => {
        setValue(val);
        setColorScheme(val);
      }}
      bg={colorScheme === "dark" ? "rgb(11,09, 28)" : undefined}
      value={value}
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
                color={
                  colorScheme === "dark"
                    ? value === "light"
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
                    ? value === "dark"
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


function Shell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isBlogPage = pathname.includes("/blog/");
  const smallScreen = useMediaQuery("(max-width: 450px)");
  const smallSizeMath = useMediaQuery("(max-width:480px)");
  const navSizeScreen = useMediaQuery("(max-width:767px)");

  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const [opened, { toggle }] = useDisclosure();
  const { user } = useUser();

  return (
    <>
      <SignedOut>
        <NotSignedIn />
      </SignedOut>
      <SignedIn>
        <AppShell
          bg={colorScheme === "dark" ? "#0f1523" : theme.colors.gray[0]}
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
        >
          <Toaster position="bottom-center" reverseOrder={false} />

          {/* Header */}
          <AppShell.Header bg={colorScheme === "dark" ? "#0f1523" : theme.colors.gray[0]}>
            <Group justify={"space-between"} h="100%" px="md">
              {navSizeScreen && <Avatar src={user?.imageUrl} onClick={toggle} alt={user?.fullName} size={"32"} />}
              <Logo />
              {navSizeScreen && <ThemeToggleButton />}
              {!navSizeScreen && <FeedBack />}
            </Group>
          </AppShell.Header>

          {/* Navbar */}
          <AppShell.Navbar p="md" bg={colorScheme === "dark" ? "#0f1523" : theme.colors.gray[0]}>
            <Stack gap={0} h="100%" justify="space-between">
              <Stack gap={0}>
                <UserCard color={colorScheme === "dark" ? "rgb(19, 27, 46)" : theme.colors.gray[0]} />
                <NavRoutes router={router} toggle={toggle} pathname={pathname} colorScheme={colorScheme} />
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
                    <Text size="sm" c={colorScheme === "dark" ? dark_theme.main_text_color : "red"} fw={500}>
                      Sign out
                    </Text>
                    <SignOut
                      weight="bold"
                      color={colorScheme === "dark" ? dark_theme.main_text_color : "#fa5252"}
                      size={16}
                    />
                  </Group>
                </SignOutButton>
                {!navSizeScreen && <ThemeToggleButton />}
                {navSizeScreen && <FeedBack />}
              </Group>
            </Stack>
          </AppShell.Navbar>

          {/* Main Content */}
          <AppShell.Main style={{ paddingInline: smallSizeMath ? 0 : undefined }}>{children}</AppShell.Main>

          {/* Bottom Navigation for SmaScreens */}
          {smallScreen && !isBlogPage && !opened && <BottomBar />}
        </AppShell>
      </SignedIn>
    </>
  );
}
export default Shell;
