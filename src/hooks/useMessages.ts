// WILL BE DEPRECATED
import { useState } from "react";

import { Message, Role } from "@custom-types";

export interface MessagesHook {
    appendMessage: (content: string, role: Role) => void;
    messages: Message[];
}

export function useMessages(): MessagesHook {
    const [messages, setMessages] = useState<Message[]>([]);

    const appendMessage = (content: string, role: Role) => {
        setMessages((oldMessages) => [
            ...oldMessages,
            { content, createdAt: new Date(), role },
        ]);
    };

    return {
        appendMessage,
        messages,
    };
}
