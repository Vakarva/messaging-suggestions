import { Badge, Flex, Paper, Text, useMantineTheme } from "@mantine/core";

import { Message, Role } from "@custom-types";

interface ChatBubbleProps {
    message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    const theme = useMantineTheme();

    const isUser = message.role === Role.user;

    const time: string = message.createdAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    return (
        <Flex align="flex-end" direction="column">
            <Paper
                bg={isUser ? theme.colors.gray[2] : theme.colors.blue[7]}
                c={isUser ? theme.black : theme.white}
                p="xs"
                shadow="xs"
                styles={{
                    root: {
                        ...(!isUser && { borderBottomRightRadius: "0" }),
                        ...(isUser && { borderBottomLeftRadius: "0" }),
                    },
                }}
                w="100%"
            >
                <Text size="lg" style={{ wordBreak: "break-all" }}>
                    {message.content}
                </Text>
            </Paper>
            <Badge color="gray" size="xs" variant="transparent">
                {time}
            </Badge>
        </Flex>
    );
}
