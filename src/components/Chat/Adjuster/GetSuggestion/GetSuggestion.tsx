import { useEffect, useMemo, useRef, useState } from "react";
import OpenAI from "openai";
import "./GetSuggestion.css"
import SuggestionContext from "./SuggestionContext/SuggestionContext";
import { ClaimContext, Message, Role } from "../../../../types/types";

export default function GetSuggestion(props: {
    apiKey: string;
    messages: Message[];
    suggestion: string;
    setSuggestion: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [context, setContext] = useState(() => new ClaimContext());
    const openaiRef = useRef<OpenAI | undefined>(undefined);

    // Disable suggestion button if there's no OpenAI instance or if most recent message did not come from "user" (aka worker)
    const mostRecentRole = props.messages.length
        ? props.messages[props.messages.length - 1].role
        : null;
    const isSuggestionDisabled = !openaiRef.current || mostRecentRole !== Role.user;

    // Construct new array, formatted for OpenAI API; memoized to avoid unnecessary recalculation
    const formattedMessages = useMemo(() => {
        const systemMessage = {
            role: Role.system,
            content: context.systemMessage
        };

        return [
            systemMessage,
            ...props.messages.map(({ role, content }) => ({ role, content })) // remove `createdAt` field from `messages` array - LLM does not need it
        ];
    }, [props.messages, context]);

    useEffect(() => {
        openaiRef.current = new OpenAI({
            apiKey: props.apiKey,
            dangerouslyAllowBrowser: true   // Privacy concerns: API Key will be visible locally
        });
    }, [props.apiKey]); // recreate OpenAI instance only if API Key changes

    // Stream the LLMs response (adapted from: https://platform.openai.com/docs/api-reference/streaming)
    async function getSuggestion() {
        if (!openaiRef.current) return;    // ensure OpenAI instance is initialized

        props.setSuggestion("");  // clear previous suggestion (if it's still there) before starting a new stream

        try {
            const stream = await openaiRef.current.chat.completions.create({
                model: "gpt-4o-mini",
                messages: formattedMessages,
                stream: true,
            });
            for await (const chunk of stream) {
                props.setSuggestion(prevSuggestion =>
                    prevSuggestion + (chunk.choices[0]?.delta?.content || "")
                );
            }
        } catch (error) {
            console.error("Error fetching suggestion:", error);
            props.setSuggestion("Failed to get suggestion. Please try again.");
        }
    }

    return (
        <div className="get-suggestion-container">
            <SuggestionContext
                context={context}
                setContext={setContext}
            />

            <button
                className="top-button"
                onClick={getSuggestion}
                disabled={isSuggestionDisabled}
            >
                Get Suggested Response
            </button>
        </div >
    );
}