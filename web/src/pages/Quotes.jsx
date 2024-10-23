import { rem, Text, Stack, Group, Loader, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '../appwrite/fetchQuotes';
import { useState } from 'react';
import { DiceOne, DiceTwo, DiceThree, DiceFour, DiceFive, DiceSix } from '@phosphor-icons/react';

function Quotes() {
    const { data: quotesData, isLoading: isQuotesLoading, isSuccess: isQuotesSuccess } = useQuery({
        queryFn: () => fetchQuotes(),
        queryKey: ["quotes"]
    })

 

    const [randomQuoteIndex, setRandomQuoteIndex] = useState(0)
    const [DiceIcon, setDiceIcon] = useState(DiceOne)

    function randomQuote() {
        setRandomQuoteIndex(Math.floor(Math.random() * quotesData.length))
    }
       function getRandomIcon() {
        const icons = [DiceOne, DiceTwo, DiceThree, DiceFour, DiceFive, DiceSix]
        setDiceIcon(icons[Math.floor(Math.random() * icons.length)])
    }

    const sizeMatch = useMediaQuery('(max-width:600px)')
    function QuoteStack({ quote }) {
        return (
            <Stack miw={300} gap={0} >
                 <Group pl={sizeMatch ? "md" : "xl"} py={"md"} style={{ borderLeft: `${sizeMatch ? "6px" : "8px"} solid rgb(115, 87, 217)` }}>
                    <Text
                        size={sizeMatch ? "md" : "xl"}
                        style={{
                            fontFamily: "Circular, sans-serif",
                            lineHeight: "1.5",
                        }}
                        fw={500}
                    >
                        {quote}
                    </Text>
                </Group>
                <Text
                    w={"100%"}
                    c={"black"}
                    style={{
                        fontFamily: "Cirular medium, sans-serif",
                    }}
                    ta={"right"}
                >
                    —The Beginning of Infinity
                </Text>
            </Stack>
        )
    }

    return (
        <Group gap={'sm'} h={'75vh'} align='center' justify='center' mx={'sm'}>
            {isQuotesSuccess && <Stack>
                <QuoteStack quote={quotesData[randomQuoteIndex].quote_text} />
            </Stack>}
            {isQuotesLoading && <Loader type='bars' />}
            <ActionIcon size={50} pos={'absolute'} bottom={'20%'} right={'10%'} variant="transparent" color="gray" radius="xl" aria-label="Settings" onClick={() => { randomQuote(); getRandomIcon() }}>
                <DiceIcon size={200} color='rgb(115, 87, 217)' weight='duotone' />
            </ActionIcon>
        </Group>
    )
}

export default Quotes;
