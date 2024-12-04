import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import {
  AppShell,
  Avatar,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Modal,
  Button,
  Input,
  Card,
  BackgroundImage,
  Text,
  ActionIcon,
  useMantineTheme,
  useComputedColorScheme,
} from "@mantine/core";
import { SignOut, FileArrowUp, Sparkle, Trash } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";

import BottomNavigationBar from "../BottomBar";
import BrandLogo from "../Logo";
import SignInPrompt from "../NotSignedIn";
import FeedbackButton from "./FeedBack";
import UserProfileCard from "./UserCard";
import NavigationRoutes from "./NavRoutes";

import { dark_theme } from "@/app/config/theme";
import ThemeSwitcher from "./ThemeSwitcher";
import { memo } from "react";
import RightBookSidebar from "../home/RightBookSideBar";
import { usePathname } from "next/navigation";
import "./Uploaded.css";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { postPDF } from "@/app/server-functions/postPDF";
import { cardShadows } from "@/app/utils/shadows";
import { useModelContext } from "@/app/contexts/ModelProvider";
import { checkIfAtLeastOneBookIsThere } from "@/appwrite/checkIfAtLeastOneBookIsThere";
import NoContentAdded from "../NoContentAdded";
import { afacad_flux } from "@/app/font";

function AppShellLayout({ children }) {
  const { user } = useUser();
  const theme = useMantineTheme();
  const { opened, close } = useModelContext();
  const [currentImage, setCurrentImage] = useState(null);
  const imageArray = Array.from({ length: 100 }, (_, i) => `${i + 1}.jpg`);

  function chooseRandomImage() {
    setCurrentImage(`/compress-cats/${imageArray[Math.floor(Math.random() * imageArray.length)]}`);
  }

  const [book, setBook] = useState(null);
  const [authorName, setAuthorName] = useState(null);
  const [bookTitle, setBookTitle] = useState(null);

  const { mutateAsync: postThePDF, status } = useMutation({
    mutationFn: postPDF,
    onSuccess: () => {
      toast.success("Book sent successfully");
      close();
      setBook(null);
      setAuthorName(null);
      setBookTitle(null);
    },
    onError: () => {
      close();
      setBook(null);
      setAuthorName(null);
      setBookTitle(null);
      toast.error("Your book is too short, try bigger one!");
    },
  });

  const {
    data: bookLength,
    isSuccess: isBookLengthSuccess,
    isLoading: isBookLengthLoading,
  } = useQuery({
    queryKey: ["bookLength"],
    queryFn: () => checkIfAtLeastOneBookIsThere({ user_id: user.id }),
    cacheTime : Infinity
  });

  // status can be idle, pending, success, error

  const mantineTheme = useMantineTheme();
  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const isCompactScreen = useMediaQuery("(max-width:480px)");
  const isTabletScreen = useMediaQuery("(max-width:767px)");
  const isDesktopScreen = useMediaQuery("(min-width:1250px)");

  const colorScheme = useComputedColorScheme();
  const [isNavbarOpen, { toggle: toggleNavbar }] = useDisclosure();

  const AppShellHeader = memo(() => (
    <AppShell.Header bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}>
      <Group justify="space-between" h="100%" px="md">
        {isTabletScreen && <Avatar src={user?.imageUrl} onClick={toggleNavbar} alt={user?.fullName} size={32} />}
        <BrandLogo />
        {isTabletScreen && <ThemeSwitcher />}
        {!isTabletScreen && <FeedbackButton />}
      </Group>
    </AppShell.Header>
  ));

  AppShellHeader.displayName = "AppShellHeader";

  const pathname = usePathname();

  return (
    <>
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
        <Modal
          radius={"xl"}
          centered
          styles={{
            content: {
              maxWidth: "310px",
            },
            body: {
              background: colorScheme === "dark" ? dark_theme.app_bg_dark_color : "white",
              paddingTop: "2rem",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "2rem",
            },
            header: {
              display: "none",
            },
          }}
          opened={opened}
          onClose={status !== "pending" && close}
          title="upload"
        >
          <Stack gap={"0"} miw={230}>
            <Input.Wrapper c={colorScheme === "dark" ? dark_theme.secondary_text_color : "dark"} l label="Book Title">
              <Input
                disabled={status === "pending"}
                radius={"md"}
                variant="filled"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                size="sm"
                placeholder="The Selfish Gene"
              />
            </Input.Wrapper>
            <Input.Wrapper c={colorScheme === "dark" ? dark_theme.secondary_text_color : "dark"} label="Author Name">
              <Input
                disabled={status === "pending"}
                radius={"md"}
                variant="filled"
                size="sm"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: Richard Dawkins"
              />
            </Input.Wrapper>
          </Stack>

          {book && (
            <Card
              shadow={cardShadows.md}
              bg={colorScheme === "dark" ? dark_theme.nav_link_dark_color : "#f1f3f5"}
              mt={"sm"}
              padding="xs"
              radius="xl"
            >
              <Group wrap="nowrap" justify="space-between">
                <Group wrap="nowrap" gap={"xs"}>
                  <BackgroundImage onClick={chooseRandomImage} src={currentImage} radius="xl" h={36} w={36} />
                  <Stack gap={0}>
                    <Text maw={140} className={afacad_flux.className} truncate={"end"} style={{ lineHeight: 1.1 }}>
                      {bookTitle}
                    </Text>
                    <Text maw={140} truncate={"end"} style={{ lineHeight: 1.1 }} size="xs" c={"gray"}>
                      {authorName && "By: "}

                      {authorName}
                    </Text>
                  </Stack>
                </Group>
                <ActionIcon
                  disabled={status === "pending"}
                  onClick={() => setBook(null)}
                  mr={"xs"}
                  size={"lg"}
                  radius={"xl"}
                  variant="light"
                  color="red"
                  aria-label="Settings"
                >
                  <Trash size={19} color="#ed333b" />
                </ActionIcon>
              </Group>
            </Card>
          )}
          {/* {authorName && bookTitle && !book ? ( */}
          <Dropzone
            styles={{
              root: {
                border: "none",
                padding: 0,
                background: "none",
              },
            }}
            onDrop={async (file) => {
              setBook(file);
              chooseRandomImage();
            }}
            onReject={() => {
              toast.error("Should not exceed 5MB");
            }}
            maxSize={6 * 1024 ** 2}
            accept={PDF_MIME_TYPE}
          >
            {!book && (
              <Group mt={"md"} justify="center" gap="xl" style={{ pointerEvents: "none" }}>
                <Dropzone.Idle>
                  <Button
                    style={{ boxShadow: cardShadows.md }}
                    variant="light"
                    leftSection={<FileArrowUp size={18} />}
                    size="sm"
                    c={colorScheme === "dark" ? dark_theme.secondary_text_color : "black"}
                    bg={colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.gray[2]}
                    fullWidth
                    radius="md"
                  >
                    Upload
                  </Button>
                </Dropzone.Idle>
              </Group>
            )}
          </Dropzone>
          {/* ) : null} */}
          {book && (
            <Button
              variant="filled"
              mt={"md"}
              styles={{ section: { marginInlineEnd: "5px" } }}
              style={{ boxShadow: cardShadows.md }}
              leftSection={
                <Sparkle
                  color={colorScheme === "dark" ? dark_theme.main_text_color : "white"}
                  size={18}
                  weight="fill"
                />
              }
              size="sm"
              fullWidth
              fw={400}
              c={colorScheme === "dark" ? dark_theme.main_text_color : "white"}
              bg={colorScheme === "dark" ? dark_theme.nav_link_dark_color : "black"}
              radius="md"
              loaderProps={{ type: "dots", color: colorScheme === "dark" ? dark_theme.secondary_text_color : "dark" }}
              loading={status === "pending"}
              onClick={async () => {
                await postThePDF({
                  id: user.id,
                  file: book,
                  authorName,
                  bookTitle,
                  currentImage,
                });
              }}
            >
              Generate
            </Button>
          )}
        </Modal>

        <AppShell
          bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !isNavbarOpen },
          }}
        >
          <Toaster position="bottom-center" reverseOrder={false} />
          <AppShellHeader />
          <AppShell.Navbar p="md" bg={colorScheme === "dark" ? "#0f1523" : mantineTheme.colors.gray[0]}>
            <Stack gap={0} h="100%" justify="space-between">
              <Stack gap={0}>
                <UserProfileCard
                  colorScheme={colorScheme}
                  fullName={user?.fullName}
                  emailAddress={user?.emailAddresses[0]?.emailAddress}
                  imageUrl={user?.imageUrl}
                  color={colorScheme === "dark" ? "rgb(19, 27, 46)" : mantineTheme.colors.gray[0]}
                />
                <NavigationRoutes toggle={toggleNavbar} colorScheme={colorScheme} />
              </Stack>
              <Group mb={"md"} justify="space-between" gap={0}>
                <SignOutButton>
                  <Group
                    gap="xs"
                    align="center"
                    p="sm"
                    justify="center"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Text size="sm" c={colorScheme === "dark" ? dark_theme.main_text_color : "red"} fontWeight={500}>
                      Sign out
                    </Text>
                    <SignOut
                      weight="bold"
                      color={colorScheme === "dark" ? dark_theme.main_text_color : "#fa5252"}
                      size={16}
                    />
                  </Group>
                </SignOutButton>
                {!isSmallScreen && <ThemeSwitcher />}
                {isSmallScreen && <FeedbackButton />}
              </Group>
            </Stack>
          </AppShell.Navbar>

          {isBookLengthSuccess && bookLength === 0 ? (
            <AppShell.Main style={{ paddingInline: isCompactScreen ? 0 : undefined }}>
              <Stack justify="center" align="center" h={'80vh'}>
                <NoContentAdded />
              </Stack>
            </AppShell.Main>
          ) : (
            <AppShell.Main style={{ paddingInline: isCompactScreen ? 0 : undefined }}>
              {pathname !== "/uploaded" && isDesktopScreen ? (
                <Group align="flex-start" wrap="nowrap">
                  <ScrollArea scrollbarSize={2} h={"100vh"} scrollbars="y">
                    {children}
                  </ScrollArea>
                  <RightBookSidebar />
                </Group>
              ) : isDesktopScreen ? (
                <Stack>{children}</Stack>
              ) : (
                !isDesktopScreen && children
              )}
            </AppShell.Main>
          )}

          {/* Bottom Navigation for Small Screens */}
          {isSmallScreen && !isNavbarOpen && <BottomNavigationBar />}
        </AppShell>
      </SignedIn>
    </>
  );
}

export default AppShellLayout;
