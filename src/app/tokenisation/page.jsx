'use client'

import { getTokenData } from "@/appwrite/get/getTokenData";
import { deleteToken } from "@/appwrite/delete/deleteToken";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cardShadows } from "../utils/shadows";
import { dark_theme } from "../config/theme";
import { ActionIcon, Badge, Button, Card, Checkbox, CopyButton, Divider, Group, Input, Loader, Modal, rem, Stack, Text, Title, Tooltip, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { useUser } from "@clerk/clerk-react";
import { afacad_flux, dm_sans } from "../font";
import { ArrowsClockwise, Check, Copy, Key, Share, Trash } from "@phosphor-icons/react";
import { useState } from "react";
import { createTokenEntry } from "@/appwrite/add/createToken";
import { formatDate } from "../helpers/helper";
import toast from "react-hot-toast";

function Tokenisation() {
    const { user: { id: user_id } } = useUser()
    const { data, isSuccess, isLoading, isError } = useQuery({
        queryKey: ['idk'],
        queryFn: () => getTokenData({ user_id })
    });
    const [tokenName, setTokenName] = useState('')
    const [tokenItSelf, setTokenItSelf] = useState(null)
    const bigScreen = useMediaQuery("(min-width:1367px)");

    const [opened, { open, close }] = useDisclosure(true);
    const colorScheme = useComputedColorScheme()
    const theme = useMantineTheme()

    const cardBackground = colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.gray[0];
    const textColor = colorScheme === "dark" ? dark_theme.main_text_color : theme.colors.gray[9];
    const initialPermissionState =
    {
        view: {
            view: true
        },
        delete: {
            delete_book: false,
            delete_blog: false,
            delete_multiple_blogs: false,
            delete_everything: false
        },
        update: {
            update_blog_name: false,
            update_blog_content: false,
            update_blog_image: false,
            update_read_status: false
        },
        generate: {
            generate_content: false
        }, sharing: {
            share_content: false
        }
    }

    const [permissionsChecks, setPermissionChecks] = useState(initialPermissionState)

    const {
        data: tokenData,
        mutateAsync: createToken,
        status,
    } = useMutation({
        mutationFn: createTokenEntry,
        onSuccess: (data) => {
            setTokenItSelf(data.token)
            setPermissionChecks(initialPermissionState)
        },
        onError: () => {
            toast.error("Something gone wrong while creating token", {
                style: {
                    backgroundColor: colorScheme === "dark" ? dark_theme.card_bg_dark_color : "black",
                    color: "white",
                },
            });
            queryClient.invalidateQueries({ queryKey: ["shareblog"] });
        },
    });

    const { mutateAsync: deleteTokenEntry, status: deleteTokenStatus, } = useMutation({
        mutationFn: deleteToken,
        onSuccess: () => {
            toast.success("Token Deleted successfully")
        },
        onError: () => {
            toast.error("Something gone wrong while creating token", {
                style: {
                    backgroundColor: colorScheme === "dark" ? dark_theme.card_bg_dark_color : "black",
                    color: "white",
                },
            });
            queryClient.invalidateQueries({ queryKey: ["whatever"] });
        },

    })

    function resetEverything() {
        setTokenName(''); setPermissionChecks(initialPermissionState); setTokenItSelf(null)
    }

    return (
        <>
            <Modal
                radius={"xl"}
                centered
                styles={{
                    content: {
                        maxWidth: "310px",
                    },
                    body: {
                        background: colorScheme === "dark" ? dark_theme.app_bg_dark_color : "white",
                        paddingTop: "1rem",
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5rem",
                        paddingBottom: "1rem",
                    },
                    header: {
                        display: "none",
                    },
                }}
                opened={opened}
                onClose={status !== "pending" && close}
                title="upload"
            >
                <Title
                    lineClamp={3}
                    ta={"center"}
                    mb={"sm"}
                    weight={600}
                    className={afacad_flux.className}
                    order={3}
                    style={{ lineHeight: 1.1 }}
                >
                    Create CLI Token
                </Title>

                <Input.Wrapper display={tokenItSelf && 'none'} mx={'xs'} mb={'sm'} c={colorScheme === "dark" ? dark_theme.secondary_text_color : "dark"} label="Token Name">
                    <Input
                        radius={"md"}
                        variant="filled"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        size="sm"
                        placeholder="Enter token name..."
                    />
                </Input.Wrapper>
                <Stack display={tokenItSelf && 'none'} mx={'xs'} gap={'md'} mb={'sm'}>
                    <Stack gap={'xs'}>
                        <Text fz={'xs'} fw={"bold"} className={dm_sans.className} >View</Text>
                        <Checkbox
                            checked={permissionsChecks.view.view}
                            size="xs"
                            label="View Content"
                            color="teal"
                        />
                    </Stack>

                    <Stack gap={'xs'}>
                        <Text fz={'xs'} fw={"bold"} className={dm_sans.className}>Delete</Text>
                        <Group justify="space-between" gap={'xs'} >
                            <Group justify="flex-start">
                                <Checkbox
                                    checked={permissionsChecks.delete.delete_book}
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        delete: {
                                            ...cur.delete,
                                            delete_book: event.target.checked
                                        }
                                    }))}
                                    size="xs"
                                    label="Book"
                                    color="teal"
                                />
                                <Checkbox
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        delete: {
                                            ...cur.delete,
                                            delete_blog: event.target.checked
                                        }
                                    }))}
                                    checked={permissionsChecks.delete.delete_blog}
                                    size="xs"
                                    label="Blog"
                                    color="teal"
                                />
                            </Group>
                            <Group justify="flex-start">
                                <Checkbox
                                    checked={permissionsChecks.delete.delete_multiple_blogs}
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        delete: {
                                            ...cur.delete,
                                            delete_multiple_blogs: event.target.checked
                                        }
                                    }))}
                                    size="xs"
                                    label="Multiple blogs"
                                    color="teal"
                                />
                                <Checkbox
                                    checked={permissionsChecks.delete.delete_everything}
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        delete: {
                                            ...cur.delete,
                                            delete_everything: event.target.checked
                                        }
                                    }))}
                                    size="xs"
                                    c={'red'}
                                    label="Everything"
                                    color="red"
                                />
                            </Group>
                        </Group>
                    </Stack>

                    <Stack gap={'xs'}>
                        <Text fz={'xs'} fw={"bold"} className={dm_sans.className}>Update</Text>
                        <Group justify="space-between" gap={'xs'}>
                            <Group justify="flex-start" >
                                <Checkbox
                                    checked={permissionsChecks.update.update_blog_name}
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        update: {
                                            ...cur.update,
                                            update_blog_name: event.target.checked
                                        }
                                    }))}
                                    size="xs"
                                    label="Blog name"
                                    color="teal"
                                />
                                <Checkbox
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        update: {
                                            ...cur.update,
                                            update_blog_content: event.target.checked
                                        }
                                    }))}

                                    checked={permissionsChecks.update.update_blog_content}
                                    size="xs"
                                    label="Blog content"
                                    color="teal"
                                />
                            </Group>
                            <Group justify="flex-start">
                                <Checkbox
                                    checked={permissionsChecks.update.update_blog_image}
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        update: {
                                            ...cur.update,
                                            update_blog_image: event.target.checked
                                        }
                                    }))}
                                    size="xs"
                                    label="Blog Image"
                                    color="teal"
                                />
                                <Checkbox
                                    onChange={(event) => setPermissionChecks(cur => ({
                                        ...cur,
                                        update: {
                                            ...cur.update,
                                            update_read_status: event.target.checked
                                        }
                                    }))}
                                    checked={permissionsChecks.update.update_read_status}
                                    size="xs"
                                    label="Read status"
                                    color="teal"

                                />
                            </Group>
                        </Group>
                    </Stack>
                    <Stack gap={'xs'}>
                        <Text fz={'xs'} fw={"bold"} className={dm_sans.className}>Generate</Text>
                        <Checkbox
                            onChange={(event) => setPermissionChecks(cur => ({
                                ...cur,
                                generate: {
                                    ...cur.generate,
                                    generate_content: event.target.checked
                                }
                            }))}
                            checked={permissionsChecks.generate.generate_content}
                            size="xs"
                            label="Generate content"
                            color="teal"
                        />
                    </Stack>
                    <Stack gap={'xs'}>
                        <Text fz={'xs'} fw={"bold"} className={dm_sans.className}>Sharing</Text>
                        <Checkbox
                            checked={permissionsChecks.sharing.share_content}
                            onChange={(event) => setPermissionChecks(cur => ({
                                ...cur,
                                sharing: {
                                    ...cur.sharing,
                                    share_content: event.target.checked
                                }
                            }))}
                            size="xs"
                            label="Share content"
                            color="teal"
                        />
                    </Stack>
                </Stack>
                <Card
                    display={!tokenItSelf && 'none'}
                    shadow={cardShadows.md}
                    maw={270}
                    style={{ cursor: "pointer" }}
                    mx="xs"
                    radius="md"
                    bg={cardBackground}
                    p={"xs"}
                >
                    <Group wrap="nowrap" justify="space-between" align="flex-start">
                        <Key size={40} />
                        <Stack gap={"0"}>
                            <Title
                                maw={190}
                                lineClamp={3}
                                weight={600}
                                className={dm_sans.className}
                                size={"sm"}
                                style={{ lineHeight: 1.1 }}
                                c={textColor}
                            >
                                Fresh CLI Token
                            </Title>
                            <Group gap={"xs"} wrap="nowrap" mt={"5"}>
                                <Badge
                                    variant="light"
                                    className={afacad_flux.className}
                                    size={"md"}
                                    w={150}
                                    color={colorScheme === "dark" ? dark_theme.main_text_color : theme.colors.gray[6]}
                                    style={{ boxShadow: cardShadows.xs }}
                                >
                                    {tokenItSelf}
                                </Badge>

                                <CopyButton value={tokenItSelf} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                            <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                                {copied ? (
                                                    <Check style={{ width: rem(16) }} />
                                                ) : (
                                                    <Copy style={{ width: rem(16) }} />
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>

                            </Group>
                        </Stack>
                    </Group>

                    {
                        status === 'success' &&
                        <Group gap={'5'} mt={'sm'}>
                            {tokenData.access.map(({ _, access_type, value }) =>
                                <Badge
                                    variant="outline"
                                    className={afacad_flux.className}
                                    size={"sm"}
                                    color={colorScheme === "dark" ? value ? dark_theme.main_text_color : "dark" : value ? theme.colors.green[6] : theme.colors.gray[4]}
                                >
                                    {access_type}
                                </Badge>

                            )}
                        </Group>

                    }
                </Card>
                <Text
                    ml={"xs"}
                    mt={"xs"}
                    size="xs"
                    fw={500}
                    display={!tokenItSelf && 'none'}
                    color={colorScheme === "dark" ? dark_theme.main_text_color : theme.colors.gray[6]}
                    className={dm_sans.className}
                >
                    Copy and Save it securely, you'll not see the same token again once close the popup.
                </Text>
                <Button
                    display={!tokenItSelf && 'none'}
                    w={270}
                    mt={"sm"}
                    mx={"xs"}
                    leftSection={<ArrowsClockwise size={16} />}
                    color={colorScheme === "dark" ? dark_theme.secondary_text_color : theme.colors.gray[2]}
                    c={colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.dark[9]}
                    radius={"md"}
                    fullWidth
                    loading={status === "pending"}
                    onClick={resetEverything}
                    loaderProps={{ type: "dots" }}
                    style={{
                        boxShadow: `${cardShadows.md}`,
                    }}
                >
                    Generate Again
                </Button>

                <Button
                    display={tokenItSelf && 'none'}
                    w={270}
                    mt={"sm"}
                    disabled={tokenName == ""}
                    mx={"xs"}
                    leftSection={<Share size={16} />}
                    color={colorScheme === "dark" ? dark_theme.secondary_text_color : theme.colors.gray[2]}
                    c={colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.dark[9]}
                    radius={"md"}
                    fullWidth
                    loading={status === "pending"}
                    onClick={() => createToken({ token_name: tokenName, access: permissionsChecks, user_id })}
                    loaderProps={{ type: "dots" }}
                    style={{
                        boxShadow: `${cardShadows.md}`,
                    }}
                >
                    Generate Token
                </Button>
            </Modal>

            {isLoading && <Loader />}
            {isError && <Title>Something went wrong</Title>}
            {isSuccess && data.length === 0 && <Title>No Token has been created</Title>}

            {isSuccess &&
                <Group maw={650}>
                    {
                        data.map(el => (
                            <Card
                                key={el.$id}
                                shadow={cardShadows.md}
                                w={"100%"}
                                bg={colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.gray[2]}
                                p="sm"
                                className={dm_sans.className}
                                maw={300}
                                radius="md"
                            >
                                <Group justify="space-between">
                                    <Stack gap={0}>
                                        <Title order={4}>{el.token_name}</Title>
                                        <Text>Created at: {formatDate(el.$createdAt)}</Text>
                                    </Stack>
                                    <ActionIcon onClick={async () => await deleteTokenEntry({ document_id: el.$id })} variant="light" size="lg" radius="xl" aria-label="Settings">
                                        <Trash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                </Group>

                                <Group gap={'5'} mt={'sm'}>

                                    {el.access.map(({ _, access_type, value }, index) =>
                                        <Badge
                                        key={index}
                                            variant="outline"
                                            className={afacad_flux.className}
                                            size={"sm"}
                                            color={colorScheme === "dark" ? value ? dark_theme.main_text_color : "dark" : value ? theme.colors.green[6] : theme.colors.gray[6]}
                                        >
                                            {access_type}
                                        </Badge>

                                    )}
                                </Group>
                            </Card>
                        ))
                    }
                </Group>
            }
        </>
    )

}
export default Tokenisation;