import { useState } from "react";

import { Message, Role } from "@custom-types";

export interface MessagesHook {
    append: (content: string, role: Role) => void;
    data: Message[];
    isSuggestionDisabled: boolean;
}

export function useMessages(): MessagesHook {
    const [data, setData] = useState<Message[]>([]);

    const append = (content: string, role: Role) => {
        setData((oldMessages) => [
            ...oldMessages,
            { content, createdAt: new Date(), role },
        ]);
    };

    const isSuggestionDisabled = (() => {
        const mostRecentRole = data.at(-1)?.role;
        return mostRecentRole !== Role.user;
    })();

    return {
        append,
        data,
        isSuggestionDisabled,
    };
}
