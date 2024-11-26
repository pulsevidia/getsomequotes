import { House, UploadSimple } from "@phosphor-icons/react";
import { Group, Stack, Text } from "@mantine/core";
import { cardShadows } from "@/app/utils/shadows";

const NavRoutes = ({ router, toggle, pathname, colorScheme }) => {
  const routes = [
    { path: "/home", label: "Home", Icon: House },
    { path: "/uploaded", label: "Uploaded", Icon: UploadSimple },
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
            router.push(route.path);
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
          <Text size="xs" c={colorScheme === "dark" ? "#f1beb5" : "dark"}>
            {route.label}
          </Text>
        </Group>
      ))}
    </Stack>
  );
};

export default NavRoutes;
