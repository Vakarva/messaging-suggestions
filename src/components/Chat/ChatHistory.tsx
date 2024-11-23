import { Box, Stack } from "@mantine/core";

import { Message, Role } from "@custom-types";

import { ChatBubble } from "@components/Chat/index";

interface ChatHistoryProps {
    bottomRef: React.ForwardedRef<HTMLDivElement>;
    messages: Message[];
}

export default function ChatHistory({ bottomRef, messages }: ChatHistoryProps) {
    const messageElements = messages.map((message) => (
        <Box
            key={message.createdAt.toISOString()}
            maw="85%"
            ml={message.role == Role.user ? "0" : "auto"}
            mr={message.role == Role.user ? "auto" : "0"}
        >
            <ChatBubble message={message} />
        </Box>
    ));

    return (
        <Stack>
            {messageElements}
            <div ref={bottomRef} />
        </Stack>
    );
}
