import {
  Avatar,
  Text,
  Card,
  AppShell,
  Burger,
  Group,
  Stack,
  useComputedColorScheme,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { House, UploadSimple, FilePlus, SignOut, Sun, Flower } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import BottomBar from "../components/BottomBar";
import Logo from "./Logo";
import NotSignedIn from "../components/NotSignedIn";
import { cardShadows } from "../utils/shadows";

// User Card Component
function UserCard({ color }) {
  const { user } = useUser();
  const colorScheme = useComputedColorScheme();

  return (
    <Card bg={color} shadow={cardShadows.xs} radius="md" py="xs" px="md" mb="md">
      <Group wrap="nowrap" justify="space-between">
        <Group wrap="nowrap" gap="md" align="center">
          <Avatar src={user.imageUrl} alt="User Avatar" />
          <Stack gap={0}>
            <Text size="sm" c={colorScheme === "dark" ? "#f1beb5" : "dark"}>{user.fullName}</Text>
            <Text size="xs" color="dimmed">{user.primaryEmailAddress.emailAddress}</Text>
          </Stack>
        </Group>
        <SignOutButton>
          <SignOut cursor="pointer" size={18} color="#3d3846" weight="bold" />
        </SignOutButton>
      </Group>
    </Card>
  );
}

// Navbar Links
const NavRoutes = ({ navigate, toggle, pathname, colorScheme }) => {
  const routes = [
    { path: "/home", label: "Home", Icon: House },
    { path: "/uploaded", label: "Uploaded", Icon: UploadSimple },
    { path: "/upload_book", label: "Upload Book", Icon: FilePlus },
  ];

  return (
    <Stack gap={0}>
      {routes.map((route) => (
        <Group
          key={route.path}
          gap="xs"
          align="center"
          p="sm"
          onClick={() => {
            navigate(route.path);
            toggle();
          }}
          style={{
            cursor: "pointer",
            boxShadow: pathname === route.path ? cardShadows.md : "none",
            borderRadius: "8px",
            background: pathname === route.path && colorScheme === "dark" ? "rgb(19, 27, 45)" : "none",
          }}
        >
          <route.Icon color={colorScheme === "dark" ? "#f1beb5" : "black"} size={16} />
          <Text size="xs" c={colorScheme === "dark" ? "#f1beb5" : "dark"}>{route.label}</Text>
        </Group>
      ))}
    </Stack>
  );
};

// Theme Toggle Button
const ThemeToggleButton = ({ colorScheme, setColorScheme }) => (
  <Group
    gap="xs"
    mb={100}
    p="sm"
    w={170}
    onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
    style={{ cursor: "pointer", boxShadow: cardShadows.md, borderRadius: "8px" }}
    bg={colorScheme === "light" ? "rgb(19, 27, 46)" : "white"}
  >
    {colorScheme === "dark" ? (
      <Sun color="black" size={16} />
    ) : (
      <Flower weight="duotone" color="#f1beb5" size={16} />
    )}
    <Text size="xs" c={colorScheme === "dark" ? "black" : "#febeb5"}>
      {colorScheme === "dark" ? "Light" : "Wanna go Purple?"}
    </Text>
  </Group>
);

function BasicAppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isBlogPage = pathname.includes("/blog/");
  const smallScreen = useMediaQuery("(max-width: 450px)");
  const smallSizeMath = useMediaQuery("(max-width:480px)");

  const theme = useMantineTheme();
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme();
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    if (pathname === "/") navigate("/home");
  }, [pathname, navigate]);

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
            <Group h="100%" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Logo />
            </Group>
          </AppShell.Header>

          {/* Navbar */}
          <AppShell.Navbar p="md" bg={colorScheme === "dark" ? "#0f1523" : theme.colors.gray[0]}>
            <Stack gap={0} h="100%" justify="space-between">
              <Stack gap={0}>
                <UserCard color={colorScheme === "dark" ? "rgb(19, 27, 46)" : theme.colors.gray[0]} />
                <NavRoutes navigate={navigate} toggle={toggle} pathname={pathname} colorScheme={colorScheme} />
            </Stack>
              <ThemeToggleButton colorScheme={colorScheme} setColorScheme={setColorScheme} />
            </Stack>
          </AppShell.Navbar>

          {/* Main Content */}
          <AppShell.Main style={{ paddingInline: smallSizeMath ? 0 : undefined }}>
            <Outlet />
          </AppShell.Main>

          {/* Bottom Navigation for Small Screens */}
          {smallScreen && !isBlogPage && <BottomBar />}
        </AppShell>
      </SignedIn>
    </>
  );
}

export default BasicAppShell;
