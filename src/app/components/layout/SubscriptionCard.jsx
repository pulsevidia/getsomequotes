import { dark_theme } from "@/app/config/theme";
import { cardShadows } from "@/app/utils/shadows";
import { getSubscription } from "@/appwrite/get/getSubscription";
import { useAuth } from "@clerk/nextjs";
import { Card, Group, Loader, Stack, Text } from "@mantine/core";
import { Crown, CrownCross, CrownSimple } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

function SubscriptionCard({ color, colorScheme }) {
    const { getToken } = useAuth()

    const { data, isLoading, isSuccess, isError } = useQuery({
        queryKey: ["blog"],
        queryFn: () => getSubscription({ getToken }),
    });

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    }

    return (
        <Card bg={color} shadow={cardShadows.md} radius="md" py="xs" px="sm" mb="md">
            {
                isLoading &&
                <Loader size={'xs'} color={colorScheme === 'dark' ? dark_theme.main_text_color : 'dark'} type="dots" mx={'auto'} />
            }
            {
                isSuccess &&
                <Group wrap="nowrap" justify="space-between">
                    <Group wrap="nowrap" gap="md" align="center">
                        {
                            data.isActiveSubscription && data.subscription_type == 'reader' &&
                            <Crown size={32} color="#9c9c9c" weight="fill" />
                        }
                        {
                            data.isActiveSubscription && data.subscription_type == 'avid_reader' &&
                            <CrownCross size={32} color="#edbd0c" weight="fill" />
                        }
                        {
                            !data.isActiveSubscription &&
                            <CrownSimple size={28} color="#a25915" weight="fill" />
                        }
                        <Stack gap={0}>
                            <Text size="sm" c={colorScheme === "dark" ? dark_theme.main_text_color : "dark"}>
                                {!data.isActiveSubscription && "FREE"}
                                {data.isActiveSubscription && data.subscription_type === 'avid_reader' && 'AVID READER'}
                                {data.isActiveSubscription && data.subscription_type == 'reader' && "READER"}
                            </Text>
                            <Group w={'100%'} justify="space-between">
                                <Text size="xs" c="dimmed">
                                    {!data.isActiveSubscription && "Get a subscription to get started"}
                                    {data.isActiveSubscription && `blogs: ${data.quota.blogs_generated}/${data.quota.allocated_blog_quota}`}
                                </Text>
                                {
                                    data.isActiveSubscription &&
                                    <Text fw={500} ml={'lg'} size="xs" c="dimmed">
                                        ends: {formatDate(data.end_date)}
                                    </Text>
                                }
                            </Group>
                        </Stack>
                    </Group>
                </Group>}
        </Card>
    );
}
export default SubscriptionCard;
