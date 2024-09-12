import { useEffect, useRef } from "react";
import { Box, ScrollArea, Stack } from "@mantine/core";
import ChatBubble from "@components/Chat/ChatHistory/ChatBubble";
import { Message, Role } from "@custom-types";

interface ChatHistoryProps {
    messages: Message[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
    const chatEndRef = useRef<HTMLDivElement | null>(null);

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
