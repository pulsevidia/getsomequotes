import React, { useEffect, useState } from "react";
import styles from "./BottomBar.module.css"; // Import the module CSS
import { House, FileArrowUp, UploadSimple } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { dark_theme } from "../config/theme";
import { useComputedColorScheme, useMantineTheme } from "@mantine/core";

function BottomBar() {
  const [active, setActive] = useState("/home");
  const pathname = usePathname();
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const handleClick = (name) => {
    setActive(name);
  };

  const router = useRouter();
  const iconColor = colorScheme === "dark" ? dark_theme.main_text_color : theme.colors.gray[9];

  const navigationOptions = [
    { name: "/home", color: iconColor },
    { name: "/upload_book", color: iconColor },
    { name: "/uploaded", color: iconColor },
  ];

  return (
    <div
      style={{
        bottom: "3%",
        position: "fixed",
        zIndex: 2323,
        padding: "1rem",
        display: "grid",
        width: "100%",
        placeItems: "center",
        transition: "background 0.2s ease-out",
      }}
    >
      <nav
        style={{ background: colorScheme === "dark" ? dark_theme.nav_link_dark_color : "white" }}
        className={styles.nav}
      >
        {navigationOptions.map((item) => (
          <a
            key={item.name}
            className={`${styles.link} ${active === item.name ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();
              handleClick(item.name, item.color);
              router.push(item.name);
            }}
            style={{
              "--hover-bg": `${item.color}20`,
              "--hover-c": item.color,
            }}
          >
            {item.name === "/home" && <House size={80} />}
            {item.name === "/upload_book" && <UploadSimple size={80} />}
            {item.name === "/uploaded" && <FileArrowUp size={80} />}
            {/* <span className={styles.linkText}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </span> */}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default BottomBar;
