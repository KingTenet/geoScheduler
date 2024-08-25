import Link from "next/link";
import {
    Avatar,
    Box,
    Button,
    Card,
    Flex,
    Inset,
    RadioCards,
    Root,
    Strong,
    Text,
} from "@radix-ui/themes";

function Size() {
    return (
        <Flex gap="3" direction="column">
            <Box width="350px">
                <Card size="1">
                    <Flex gap="3" align="center">
                        <Avatar
                            size="3"
                            radius="full"
                            fallback="T"
                            color="indigo"
                        />
                        <Box>
                            <Text as="div" size="2" weight="bold">
                                Teodros Girmay
                            </Text>
                            <Text as="div" size="2" color="gray">
                                Engineering
                            </Text>
                        </Box>
                    </Flex>
                </Card>
            </Box>

            <Box width="400px">
                <Card size="2">
                    <Flex gap="4" align="center">
                        <Avatar
                            size="4"
                            radius="full"
                            fallback="T"
                            color="indigo"
                        />
                        <Box>
                            <Text as="div" weight="bold">
                                Teodros Girmay
                            </Text>
                            <Text as="div" color="gray">
                                Engineering
                            </Text>
                        </Box>
                    </Flex>
                </Card>
            </Box>

            <Box width="500px">
                <Card size="3">
                    <Flex gap="4" align="center">
                        <Avatar
                            size="5"
                            radius="full"
                            fallback="T"
                            color="indigo"
                        />
                        <Box>
                            <Text as="div" size="4" weight="bold">
                                Teodros Girmay
                            </Text>
                            <Text as="div" size="4" color="gray">
                                Engineering
                            </Text>
                        </Box>
                    </Flex>
                </Card>
            </Box>
        </Flex>
    );
}

function CardAsAnotherElement() {
    return (
        <Box maxWidth="350px">
            <Card asChild>
                <a href="#">
                    <Text as="div" size="2" weight="bold">
                        Quick start
                    </Text>
                    <Text as="div" color="gray" size="2">
                        Start building your next project in minutes
                    </Text>
                </a>
            </Card>
        </Box>
    );
}

function WithInset() {
    return (
        <>
            <Box maxWidth="240px">
                <Card size="2">
                    <Inset clip="padding-box" side="top" pb="current">
                        <img
                            src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                            alt="Bold typography"
                            style={{
                                display: "block",
                                objectFit: "cover",
                                width: "100%",
                                height: 140,
                                backgroundColor: "var(--gray-5)",
                            }}
                        />
                    </Inset>
                    <Text as="p" size="3">
                        <Strong>Typography</Strong> is the art and technique of
                        arranging type to make written language legible,
                        readable and appealing when displayed.
                    </Text>
                </Card>
            </Box>
        </>
    );
}

function RadioCardsExample() {
    return (
        <Flex align="center" gap="3">
            <RadioCards.Root size="1">
                <RadioCards.Item value="1">8-core CPU</RadioCards.Item>
            </RadioCards.Root>

            <RadioCards.Root size="2">
                <RadioCards.Item value="1">8-core CPU</RadioCards.Item>
            </RadioCards.Root>

            <RadioCards.Root size="3">
                <RadioCards.Item value="1">8-core CPU</RadioCards.Item>
            </RadioCards.Root>
        </Flex>
    );
}

export default function Cards() {
    return (
        <>
            <CardAsAnotherElement />
            <WithInset />
            <Size />
            <RadioCardsExample />
        </>
    );
}
