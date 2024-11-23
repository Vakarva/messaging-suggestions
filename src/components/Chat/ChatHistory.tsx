import { forwardRef } from "react";
import { Box, Stack } from "@mantine/core";

import { Message, Role } from "@custom-types";

import { ChatBubble } from "@components/Chat/index";

interface ChatHistoryProps {
    messages: Message[];
}

export default forwardRef(function ChatHistory(
    { messages }: ChatHistoryProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
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
            <div ref={ref} />
        </Stack>
    );
});
