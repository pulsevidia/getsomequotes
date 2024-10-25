import { Button, Divider, Group, Modal, Text, Title } from "@mantine/core";
import { ArrowCircleUp } from "@phosphor-icons/react";


function BookListGenerateModal({ isOpened, close, bookId }) {
    return (
        <Modal radius={'xl'} styles={{
            header: {
                display: 'none'
            }
            , body: {
                padding: '1.5rem',
                paddingBottom: '1rem', paddingRight: '1.5rem', paddingLeft: '1.5rem',
            }
        }} centered opened={isOpened} onClose={close} title="Authentication">
            <Group gap={'xs'} wrap="nowrap" >
                <ArrowCircleUp size={42} weight="fill" />
                <Title order={4} fw={500}>Generate More Content?</Title>
            </Group>
            <Divider my={'sm'} />
            <Text fz={'sm'} color="dimmed">Generate 5 blogs and 20 quotes from this book?</Text>
            <Group gap={'sm'} justify="flex-end" mt="md" mb="xs">
                <Button onClick={close} variant="transparent" color="rgba(0, 0, 0, 1)" size="xs">Cancel</Button>
                <Button variant="light" color="rgba(0, 0, 0, 1)" size="xs">Generate</Button>
            </Group>
        </Modal>

    )
}
export default BookListGenerateModal;