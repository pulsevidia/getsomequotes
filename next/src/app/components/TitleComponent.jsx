import { Title, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { Spectral } from "next/font/google";

const spectral = Spectral({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const TitleComponent = ({ children, order = 1, style = {} }) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const color = colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9];
  return (
    <Title c={color} style={{ ...style }} className={spectral.className} fw={500} order={order}>
      {children}
    </Title>
  );
};

export default TitleComponent;
