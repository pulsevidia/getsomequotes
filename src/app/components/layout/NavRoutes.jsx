import { House, UploadSimple } from "@phosphor-icons/react";
import { Group, Stack, Text } from "@mantine/core";
import { cardShadows } from "@/app/utils/shadows";
import { usePathname, useRouter } from "next/navigation";
import { memo } from "react";

const NavRoutes = ({ toggle, colorScheme }) => {
  const routes = [
    { path: "/", label: "Home", Icon: House },
    { path: "/uploaded", label: "Uploaded", Icon: UploadSimple },
  ];
  const router = useRouter();
  const pathname = usePathname();

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

export default memo(NavRoutes);
