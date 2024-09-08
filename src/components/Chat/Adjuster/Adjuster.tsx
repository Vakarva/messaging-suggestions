import { useState } from "react";
import { Message, Role } from "../../../types/types";
import GetSuggestion from "./GetSuggestion/GetSuggestion";
import ChatInput from "../ChatInput/ChatInput";


export default function Adjuster(props: {
    apiKey: string;
    addMessage: (text: string, role: Role) => void;
    messages: Message[]
}) {
    const [suggestion, setSuggestion] = useState("");

    return (
        <>
            <GetSuggestion
                apiKey={props.apiKey}
                messages={props.messages}
                suggestion={suggestion}
                setSuggestion={setSuggestion}
            />

            <ChatInput
                addMessage={props.addMessage}
                role={Role.assistant}
                content={suggestion}
            />
        </>
    );
}