import { useEffect, useState } from "react";
import OpenAI from "openai";
import "./Suggestions.css"
import { Role, Message } from "../../../../types/types";

export default function Suggestions(props: {
    apiKey: string;
    messages: Message[];
    suggestion: string;
    setSuggestion: React.Dispatch<React.SetStateAction<string>>;
    setHasCopiedSuggestion: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    /* State Variables */
    const [openai, setOpenai] = useState<OpenAI | null>(null);

    /* Static Properties */
    // Establish how you want the LLM to behave (and what sort of knowledge it should have about GainLife)
    const systemMessage = {
        role: Role.system,
        content: "You are a helpful insurance claims adjuster. You are aiding an injured worker with any questions they have about their insurance case. Please respond in a way that is easy to read in a chat interface. Avoid using markdown such as bold, numbered lists, or headings. Keep your responses conversational and plain-text only, with short and simple sentences."
    };
    // Create new array with `systemMessage` at the head, followed by cleaned `messages` array
    const formattedMessages = [
        systemMessage,
        ...props.messages.map(({ role, content }) => ({ role, content })) // remove `id` field from `messages` array - LLM does not need it
    ];
    const isCopyDisabled = !props.suggestion.trim();

    /* useEffect Hooks */
    useEffect(() => {
        const openAIInstance = new OpenAI({
            apiKey: props.apiKey,
            dangerouslyAllowBrowser: true   // API Key will be visible locally, but the user enters their own API key
        });
        setOpenai(openAIInstance);
    }, [props.apiKey]); // recreate OpenAI instance only if API Key changes

    /* Functions */
    // Stream the LLMs response (adapted from: https://platform.openai.com/docs/api-reference/streaming)
    async function getSuggestion() {
        if (!openai) return;    // ensure OpenAI instance is initialized

        props.setSuggestion("");  // clear previous suggestion (if it's still there) before starting a new stream

        try {
            const stream = await openai.chat.completions.create({
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
        <div className="suggestion-container">
            <button
                className="top-button"
                onClick={getSuggestion}
                disabled={!openai}  // disable if openai instance is not available
            >
                {props.suggestion ? "Get New Suggestion" : "Get Suggestion"}
            </button>

            <div className="suggestion">{props.suggestion}</div>

            <button
                className="bottom-button"
                onClick={() => props.setHasCopiedSuggestion(true)}
                disabled={isCopyDisabled}
            >
                Copy
            </button>
        </div>
    );
}