import {
  Group,
  Modal,
  Button as MantineButton,
  Stack,
  Input,
  Card,
  BackgroundImage,
  Text,
  ActionIcon,
  Divider,
} from "@mantine/core";
import { memo } from "react";

const Button = memo(({ children, ...props }) => <MantineButton {...props}>{children}</MantineButton>);

export { Button };
