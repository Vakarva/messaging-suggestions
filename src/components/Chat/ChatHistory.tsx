import { useEffect } from "react";
import { Box, Stack } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";

import { Message, Role } from "@custom-types";

import ChatBubble from "@components/Chat/ChatBubble";

interface ChatHistoryProps {
    messageData: Message[];
}

export default function ChatHistory({ messageData }: ChatHistoryProps) {
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();

    const messageElements = messageData.map((message) => (
        <Box
            key={message.createdAt.toISOString()}
            maw="85%"
            ml={message.role == Role.user ? "0" : "auto"}
            mr={message.role == Role.user ? "auto" : "0"}
        >
            <ChatBubble message={message} />
        </Box>
    ));

    useEffect(() => {
        scrollIntoView();
    }, [messageData]);

    return (
        <Stack>
            {messageElements}
            <div ref={targetRef} />
        </Stack>
    );
}
