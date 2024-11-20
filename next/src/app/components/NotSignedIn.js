import { Container, Text, Button, Group } from "@mantine/core";
import classes from "./NotSignedIn.module.css";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function NotSignedIn() {
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Purplenight{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            Helping You
          </Text>{" "}
          read books everytime
        </h1>

        <Group className={classes.controls}>
          <SignUpButton mode="modal">
            <Button
              size="xl"
              className={classes.control}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              Sign up
            </Button>
          </SignUpButton>

          <SignInButton mode="modal">
            <Button
              component="a"
              size="xl"
              variant="default"
              className={classes.control}
            >
              Sign in
            </Button>
          </SignInButton>
        </Group>
      </Container>
    </div>
  );
}
