import { useState } from "react";
import "./Adjuster.css";
import { Message, Role } from "../../../types/types";
import Suggestions from "./Suggestions/Suggestions";
import ChatInput from "../ChatInput/ChatInput";


export default function Adjuster(props: {
    apiKey: string;
    addMessage: (text: string, role: Role) => void;
    messages: Message[]
}) {
    const [copiedSuggestion, setCopiedSuggestion] = useState("");

    function copySuggestion(suggestion: string) {
        setCopiedSuggestion(suggestion);
    }

    return (
        <div className="adjustor">
            <Suggestions
                apiKey={props.apiKey}
                messages={props.messages}
                copySuggestion={copySuggestion}
            />

            <ChatInput
                addMessage={props.addMessage}
                role={Role.assistant}
                content={copiedSuggestion}
            />
        </div>
    );
}