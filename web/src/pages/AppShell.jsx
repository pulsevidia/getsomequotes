import { AppShell, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { House, UploadSimple, FilePlus } from "@phosphor-icons/react";
import { useEffect } from "react";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import Logo from "./Logo";
import { Toaster } from "react-hot-toast";

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
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
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
        <NavLink
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
          color="violet"
          active={pathname === "uploaded"}
          label="Uploaded"
          onClick={() => {
            navigate("uploaded");
            toggle();
          }}
          leftSection={<UploadSimple size={16} />}
        />
        <NavLink
          color="violet"
          active={pathname === "upload_book"}
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
  );
}
export default BasicAppShell;
