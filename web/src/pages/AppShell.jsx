import { AppShell, Burger, Group, NavLink, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { Toaster } from 'react-hot-toast'
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { House, Quotes, UploadSimple, Sun, Moon, FilePlus } from "@phosphor-icons/react";
import { useEffect } from "react";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import Logo from "./Logo";

function BasicAppShell() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isBlogPage = pathname.includes('/blog/')

  useEffect(() => {
    if (pathname === '/') {
      navigate('/home');
    }
  }, [pathname, navigate]);

  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const smallScreen = useMediaQuery('(max-width: 450px)');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />

      <AppShell.Header>
        <Group h="100%" px="md" gap={'xs'}>
          <Burger lineSize={1} opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
            navigate("/home")
            toggle()
          }}
        />
        <NavLink
          color="violet"
          active={pathname === "/quotes"}
          label="Quotes"
          onClick={() => {
            navigate("/quotes")
            toggle()
          }}
          leftSection={<Quotes size={16} />}
        />
        <NavLink
          color="violet"
          active={pathname === "uploaded"}
          label="Uploaded"
          onClick={() => {
            navigate("uploaded")
            toggle()
          }}
          leftSection={<UploadSimple size={16} />}
        />
        <NavLink
          color="violet"
          active={pathname === "upload_book"}
          label="Upload Book"
          leftSection={<FilePlus size={16} />}
          onClick={() => {
            navigate("upload_book")
            toggle()
          }}
        />
        <NavLink
          color="violet"
          label="Theme"
          onClick={() => {
            setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')
            toggle()
          }}
          leftSection={computedColorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        />
      </AppShell.Navbar>
      <AppShell.Main styles={{
        main: {
          paddingInlineStart: 0,
          paddingInlineEnd: 0,
        }
      }} >

        <Outlet />
      </AppShell.Main>
      {smallScreen && !isBlogPage && <BottomBar />}
    </AppShell>
  );
}
export default BasicAppShell;
