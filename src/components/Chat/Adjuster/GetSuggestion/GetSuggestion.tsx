import { useEffect, useMemo, useState } from "react";
import OpenAI from "openai";
import "./GetSuggestion.css"
import { Role, Message } from "../../../../types/types";

export default function GetSuggestion(props: {
    apiKey: string;
    messages: Message[];
    suggestion: string;
    setSuggestion: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [openai, setOpenai] = useState<OpenAI | null>(null);
    const [context, setContext] = useState({
        claimId: "",
        nextAppointment: null as Date | null,
        nextPaymentAmount: null as number | null,
        nextPaymentDate: null as Date | null
    });

    // Disable suggestion button if there's no OpenAI instance or if most recent message did not come from "user" (aka worker)
    const mostRecentRole = props.messages.length
        ? props.messages[props.messages.length - 1].role
        : null;
    const isSuggestionDisabled = !openai || mostRecentRole !== Role.user;

    // Construct new array, formatted for OpenAI API; memoized to avoid unnecessary recalculation
    const formattedMessages = useMemo(() => {
        // Prompt how LLM ought to behave (include any knowledge it should have about GainLife)
        const systemMessage = {
            role: Role.system,
            content: "You are a helpful insurance claims adjuster. You are aiding an injured worker and responding to any questions they have about their insurance case. Please respond in a way that is easy to read in a chat interface. Avoid using markdown such as bold, numbered lists, or headings. Keep your responses conversational and plain-text only, with short and simple sentences."
        };

        return [
            systemMessage,
            ...props.messages.map(({ role, content }) => ({ role, content })) // remove `id` field from `messages` array - LLM does not need it
        ];
    }, [props.messages]);

    useEffect(() => {
        const openAIInstance = new OpenAI({
            apiKey: props.apiKey,
            dangerouslyAllowBrowser: true   // API Key will be visible locally, but the user enters their own API key
        });
        setOpenai(openAIInstance);
    }, [props.apiKey]); // recreate OpenAI instance only if API Key changes

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
        <button
            className="top-button"
            onClick={getSuggestion}
            disabled={isSuggestionDisabled}
        >
            Get Suggested Response
        </button>
    );
}