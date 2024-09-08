import { useEffect, useState } from "react";
import { Message, Role } from "../../../types/types";
import Suggestions from "./Suggestions/Suggestions";
import ChatInput from "../ChatInput/ChatInput";


export default function Adjuster(props: {
    apiKey: string;
    addMessage: (text: string, role: Role) => void;
    messages: Message[]
}) {
    const [suggestion, setSuggestion] = useState("");
    const [hasCopiedSuggestion, setHasCopiedSuggestion] = useState(false);

    useEffect(() => {
        if (hasCopiedSuggestion) {
            setHasCopiedSuggestion(false);
        }
    }, [hasCopiedSuggestion]);

    return (
        <>
            <Suggestions
                apiKey={props.apiKey}
                messages={props.messages}
                suggestion={suggestion}
                setSuggestion={setSuggestion}
                setHasCopiedSuggestion={setHasCopiedSuggestion}
            />

            <ChatInput
                addMessage={props.addMessage}
                role={Role.assistant}
                content={hasCopiedSuggestion ? suggestion : undefined}
            />
        </>
    );
}