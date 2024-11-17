import {
  Avatar,
  Text,
  Card,
  AppShell,
  Burger,
  Group,
  NavLink,
  Stack,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useColorScheme, useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  House,
  UploadSimple,
  FilePlus,
  SignOut,
  Upload,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import Logo from "./Logo";
import { Toaster } from "react-hot-toast";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import NotSignedIn from "../components/NotSignedIn";
import { cardShadows } from "../utils/shadows";

function UserCard() {
  const { user } = useUser();
  return (
    <Card shadow={cardShadows.xs} radius={"md"} py="xs" pr={"md"} pl={"xs"} mb={"md"}>
      <Group justify="space-between">
        <Group gap={"md"} align="center">
          <Avatar src={user.imageUrl} alt="it's me" />
          <Stack gap={0}>
            <Text size="sm">{user.fullName}</Text>
            <Text size="xs" color="dimmed">
              {user.primaryEmailAddress.emailAddress}
            </Text>
          </Stack>
        </Group>
        <SignOutButton>
          <SignOut cursor={"pointer"} size={18} color="#3d3846" weight="bold" />
        </SignOutButton>
      </Group>
    </Card>
  );
}

function BasicAppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isBlogPage = pathname.includes("/blog/");
  const smallSizeMath = useMediaQuery("(max-width:480px)");
  const theme = useMantineTheme();
  const [whatHovered, setWhatHovered] = useState({
    isHovered: false,
    navLink: false,
  });

  const smallScreenShell = {
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  };

  useEffect(() => {
    if (pathname === "/") {
      navigate("/home");
    }
  }, [pathname, navigate]);

  const [opened, { toggle }] = useDisclosure();
  const smallScreen = useMediaQuery("(max-width: 450px)");
  const nav_routes = [
    { path: "/home", label: "Home", Icon: House },
    { path: "/uploaded", label: "Uploaded", Icon: UploadSimple },
    { path: "/upload_book", label: "Upload Book", Icon: FilePlus },
  ];

  return (
    <>
      <SignedOut>
        <NotSignedIn />
      </SignedOut>

      <SignedIn>
        {" "}
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <Toaster position="bottom-center" reverseOrder={false} />

          <AppShell.Header>
            <Group h="100%" px="md" gap={"xs"}>
              <Burger
                lineSize={1}
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Logo />
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <UserCard />
            <Stack gap={0}>
              {nav_routes.map((Route) => (
                <Group
                  gap={"xs"}
                  justify="flex-start"
                  align="center"
                  p={"sm"}
                  onMouseEnter={() =>
                    setWhatHovered((state) => ({
                      ...state,
                      isHovered: true,
                      navLink: Route.path,
                    }))
                  }
                  onMouseLeave={() =>
                    setWhatHovered((state) => ({
                      ...state,
                      isHovered: true,
                      navLink: Route.path,
                    }))
                  }
                  onClick={() => {
                    navigate(Route.path);
                    toggle();
                  }}
                  bg={
                    pathname !== Route.path &&
                    whatHovered.isHovered &&
                    whatHovered.navLink === Route.path
                      ? theme.colors.gray[0]
                      : "none"
                  }
                  style={{
                    cursor: "pointer",
                    boxShadow: pathname === Route.path && cardShadows.md,
                    borderRadius: "8px",
                  }}
                >
                  <Route.Icon size={16} />
                  <Text size="xs">{Route.label}</Text>
                </Group>
              ))}
            </Stack>
          </AppShell.Navbar>
          <AppShell.Main
            styles={{
              main: smallSizeMath && smallScreenShell,
            }}
          >
            <Outlet />
          </AppShell.Main>
          {smallScreen && !isBlogPage && <BottomBar />}
        </AppShell>
      </SignedIn>
    </>
  );
}
export default BasicAppShell;
