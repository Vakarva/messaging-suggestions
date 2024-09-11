import { useState } from "react";
import { Message, LLMProvider, Role } from "@custom-types";
import GetSuggestion from "@components/Chat/Adjuster/GetSuggestion/GetSuggestion";
import ChatInput from "@components/Chat/ChatInput/ChatInput";

interface AdjusterProps {
    addMessage: (text: string, role: Role) => void;
    messages: Message[];
    provider: LLMProvider;
}

export default function Adjuster({
    addMessage,
    messages,
    provider,
}: AdjusterProps) {
    const [suggestion, setSuggestion] = useState("");

    return (
        <>
            <GetSuggestion
                messages={messages}
                provider={provider}
                setSuggestion={setSuggestion}
            />

            <ChatInput
                addMessage={addMessage}
                insertedContent={suggestion}
                role={Role.assistant}
            />
        </>
    );
}
