import { dark_theme } from "@/app/config/theme";
import { dm_sans } from "@/app/font";
import { cardShadows } from "@/app/utils/shadows";
import { getSubscription } from "@/appwrite/get/getSubscription";
import { useAuth } from "@clerk/nextjs";
import { Button, Card, Center, Group, Loader, Stack, Text } from "@mantine/core";
import { Crown, CrownCross, CrownSimple } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

function SubscriptionCard({ open, colorScheme }) {
    const { getToken } = useAuth()

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ["blog"],
        queryFn: () => getSubscription({ getToken }),
    });

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    }

    return (
        <Card bg={colorScheme === 'dark' ? dark_theme.nav_link_dark_color: ''} shadow={cardShadows.xs} radius="md" py="xs" px="sm" mb="md">
            {
                isLoading &&
                <Loader size={'xs'} color={colorScheme === 'dark' ? dark_theme.main_text_color : 'dark'} type="dots" mx={'auto'} />
            }
            {
                isSuccess &&
                <Group wrap="nowrap" justify="space-between">
                    <Group wrap="nowrap" gap="md" align="center" >
                        <Card w={30} h={30} p={0} bg={'white'} shadow={cardShadows.xs} radius={'md'}>
                            <Center h={'60'}>

                                {
                                    data.isActiveSubscription && data.subscription_type == 'reader' &&
                                    <Crown size={18} color="#9c9c9c" weight="fill" />
                                }
                                {
                                    data.isActiveSubscription && data.subscription_type == 'avid_reader' &&
                                    <CrownCross size={18} color="#edbd0c" weight="fill" />
                                }
                                {
                                    !data.isActiveSubscription &&
                                    <CrownSimple size={22} color="#a25915" weight="fill" />
                                }

                            </Center>
                        </Card>
                        <Stack gap={0}>
                            <Text size="sm" c={colorScheme === "dark" ? dark_theme.main_text_color : "dark"}>
                                {data.isActiveSubscription && data.subscription_type === 'avid_reader' && 'Avid Reader'}
                                {data.isActiveSubscription && data.subscription_type == 'reader' && "Reader"}
                            </Text>
                            <Group w={'100%'} justify="flex-start" wrap="nowrap">
                                {!data.isActiveSubscription &&
                                    <Button
                                        leftSection={<Crown weight="duotone" size={22} />}
                                        size='sm' gradient={{ from: 'violet', to: 'grape', deg: 90 }} variant="gradient" className={dm_sans.className} radius={'xl'} onClick={open}>Get Plan</Button>}
                                <Text size="xs" c="dimmed">
                                    {data.isActiveSubscription && `blogs: ${data.quota.blogs_generated}/${data.quota.allocated_blog_quota}`}
                                </Text>
                                {
                                    data.isActiveSubscription &&
                                    <Text fw={500} size="xs" c="dimmed">
                                        ends: {formatDate(data.end_date)}
                                    </Text>
                                }
                            </Group>
                        </Stack>
                    </Group>
                </Group>
            }
        </Card >
    );
}
export default SubscriptionCard;
