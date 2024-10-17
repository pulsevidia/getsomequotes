import { AppShell, Burger, Group, NavLink, Title, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { House, Quotes, UploadSimple, Sun, Moon, FilePlus } from "@phosphor-icons/react";
import { useEffect } from "react";

import { Outlet, useNavigate, useLocation } from "react-router-dom";

function BasicAppShell() {
  const navigate = useNavigate()
  const {pathname} = useLocation()

  useEffect(() => {
    if (pathname=== '/') {
      navigate('/home');
    }
  }, [pathname, navigate]);

  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>GetMyQuotes</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink
          active={pathname === "/home"}
          label="Home"
          leftSection={<House size={16} />}
          onClick={() => {
            navigate("/home")
            toggle()
          }}
        />
        <NavLink
          active={pathname === "/quotes"}
          label="Quotes"
          onClick={() => {
            navigate("/quotes")
            toggle()
          }}
          leftSection={<Quotes size={16} />}
        />

        <NavLink
          active={pathname === "uploaded"}
          label="Uploaded"
          onClick={() => {
            navigate("uploaded")
            toggle()
          }}
          leftSection={<UploadSimple size={16} />}
        />
        <NavLink
          active={pathname === "upload_book"}
          label="Upload Book"
          leftSection={<FilePlus size={16} />}
          onClick={() => {
            navigate("upload_book")
            toggle()
          }}
        />
        <NavLink
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
    </AppShell>
  );
}
export default BasicAppShell;
