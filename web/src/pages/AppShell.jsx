import {
  Avatar,
  Text,
  Card,
  AppShell,
  Burger,
  Group,
  NavLink,
  Stack,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { House, UploadSimple, FilePlus, SignOut } from "@phosphor-icons/react";
import { useEffect } from "react";

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

function UserCard() {
  const { user } = useUser();
  return (
    <Card withBorder radius={"md"} py="xs" pr={"md"} pl={"xs"} mb={"md"}>
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

  useEffect(() => {
    if (pathname === "/") {
      navigate("/home");
    }
  }, [pathname, navigate]);

  const [opened, { toggle }] = useDisclosure();
  const smallScreen = useMediaQuery("(max-width: 450px)");
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
            <NavLink
              style={{ borderRadius: "8px" }}
              color="violet"
              active={pathname === "/home"}
              label="Home"
              leftSection={<House size={16} />}
              onClick={() => {
                navigate("/home");
                toggle();
              }}
            />
            <NavLink
              style={{ borderRadius: "8px" }}
              color="violet"
              active={pathname === "/uploaded"}
              label="Uploaded"
              onClick={() => {
                navigate("uploaded");
                toggle();
              }}
              leftSection={<UploadSimple size={16} />}
            />
            <NavLink
              style={{ borderRadius: "8px" }}
              color="violet"
              active={pathname === "/upload_book"}
              label="Upload Book"
              leftSection={<FilePlus size={16} />}
              onClick={() => {
                navigate("upload_book");
                toggle();
              }}
            />
          </AppShell.Navbar>
          <AppShell.Main
            styles={{
              main: {
                paddingInlineStart: 0,
                paddingInlineEnd: 0,
              },
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
