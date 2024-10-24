import { Group, Skeleton } from '@mantine/core';

function BookListSkeleton() {
  return <Group m={'md'} w={'100%'} gap={'xs'}>
    {Array.from({ length: 10 }).map((_, index) => (
      <Skeleton key={index} height={18} mt={6} width="100%" radius="xs" />
    ))}
  </Group>
}
export default BookListSkeleton