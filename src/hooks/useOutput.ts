import { useState } from "react";
import { useScrollIntoView } from "@mantine/hooks";

import { Message, Role } from "@custom-types";

export interface OutputHook {
    append: (content: string, role: Role) => void;
    messages: Message[];
    messagesBottomRef: React.MutableRefObject<HTMLDivElement>;
    isSuggestionDisabled: boolean;
}

export default function useOutput(): OutputHook {
    const [messages, _setMessages] = useState<Message[]>([]);
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();

    const append = (content: string, role: Role) => {
        _setMessages((oldMessage) => [
            ...oldMessage,
            { content, createdAt: new Date(), role },
        ]);
        scrollIntoView();
    };

    const isSuggestionDisabled = (() => {
        const mostRecentRole = messages.at(-1)?.role;
        return mostRecentRole !== Role.user;
    })();

    return {
        append,
        messages,
        messagesBottomRef: targetRef,
        isSuggestionDisabled,
    };
}
