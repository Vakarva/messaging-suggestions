import { useEffect, useRef } from "react";
import { Box, ScrollArea, Stack } from "@mantine/core";

import { Message, Role } from "@custom-types";

import ChatBubble from "@components/Chat/ChatBubble";

interface ChatHistoryProps {
    messages: Message[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const messageElements = messages.map((message) => (
        <Box
            key={message.createdAt.toISOString()}
            ml={message.role == Role.user ? "0" : "auto"}
            mr={message.role == Role.user ? "auto" : "0"}
            maw="85%"
        >
            <ChatBubble message={message} />
        </Box>
    ));

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <ScrollArea offsetScrollbars scrollbarSize={6} type="scroll">
            <Stack>
                {messageElements}
                <div ref={chatEndRef} />
            </Stack>
        </ScrollArea>
    );
}
