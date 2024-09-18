import { useEffect, useState } from "react";

import { Message, Role } from "@custom-types";

export interface OutputHook {
    append: (content: string, role: Role) => void;
    messages: Message[];
    isSuggestionDisabled: boolean;
}

export function useOutput(): OutputHook {
    const [messages, _setMessages] = useState<Message[]>(() =>
        JSON.parse(localStorage.getItem("messages") ?? "[]")
    );

    const append = (content: string, role: Role) => {
        _setMessages((oldMessage) => [
            ...oldMessage,
            { content, createdAt: new Date(), role },
        ]);
    };

    const isSuggestionDisabled = (() => {
        const mostRecentRole = messages.at(-1)?.role;
        return mostRecentRole !== Role.user;
    })();

    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    return {
        append,
        messages,
        isSuggestionDisabled,
    };
}