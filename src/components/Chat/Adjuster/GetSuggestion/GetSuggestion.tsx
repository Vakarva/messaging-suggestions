import { useState } from "react";
import { Button } from "@mantine/core";
import "./GetSuggestion.css";
import SuggestionContext from "@components/Chat/Adjuster/GetSuggestion/SuggestionContext/SuggestionContext";
import { ClaimContext, LLMProvider, Message, Role } from "@custom-types";

interface GetSuggestionProps {
    messages: Message[];
    provider: LLMProvider;
    setSuggestion: React.Dispatch<React.SetStateAction<string>>;
}

export default function GetSuggestion({
    messages,
    provider,
    setSuggestion,
}: GetSuggestionProps) {
    const [context, setContext] = useState(() => new ClaimContext());

    // Disable suggestion button if most recent message did not come from "user" (aka worker)
    const mostRecentRole = messages.length
        ? messages[messages.length - 1].role
        : null;
    const isSuggestionDisabled = mostRecentRole !== Role.user;

    // Stream the LLMs response
    async function getSuggestion() {
        setSuggestion(""); // clear previous suggestion (if it's still there) before starting a new stream

        try {
            provider.getSuggestion(context, messages, setSuggestion);
        } catch (error) {
            console.error("Error fetching suggestion:", error);
            setSuggestion("Failed to get suggestion. Please try again.");
        }
    }

    return (
        <div className="get-suggestion-container">
            <SuggestionContext context={context} setContext={setContext} />

            <button
                className="top-button"
                onClick={getSuggestion}
                disabled={isSuggestionDisabled}
            >
                Get Suggested Response
            </button>
        </div>
    );
}
