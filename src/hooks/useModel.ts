import { useState } from "react";

import { LlmApiClient, LlmApiClientType, Message, Role } from "@custom-types";
import {
    ClaimContext,
    ClaimContextHook,
    useClaimContext,
} from "@hooks/useClaimContext";

export interface ModelHook {
    appendMessage: (content: string, role: Role) => void;
    claimContext: ClaimContextHook;

    llmApiClient: LlmApiClient<LlmApiClientType>;
    messages: Message[];
    llmModelName: string;
    setModel: ({
        newClaimContext,
        newLlmModelName,
        newMessages,
    }: Partial<{
        newClaimContext: ClaimContext;
        newLlmModelName: string;
        newMessages: Message[];
    }>) => void;
    setLlmModelName: React.Dispatch<React.SetStateAction<string>>;
    streamResponse: (
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ) => Promise<void>;
}

export function useModel(
    llmApiClient: LlmApiClient<LlmApiClientType>
): ModelHook {
    const claimContext = useClaimContext({});
    const [llmModelName, setLlmModelName] = useState<string>(
        llmApiClient.defaultModelName
    );
    const [messages, setMessages] = useState<Message[]>([]);

    const appendMessage = (content: string, role: Role) => {
        setMessages((oldMessages) => [
            ...oldMessages,
            { content, createdAt: new Date(), role },
        ]);
    };

    const streamResponse = async (
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ): Promise<void> => {
        const prompt = claimContext.buildSystemMessage();
        try {
            const stream = await llmApiClient.getStream(
                prompt,
                messages,
                llmModelName
            );
            await llmApiClient.writeStream(
                stream,
                initializeOutput,
                appendToOutput
            );
        } catch (error) {
            throw error;
        }
    };

    const setModel = ({
        newClaimContext,
        newLlmModelName,
        newMessages,
    }: Partial<{
        newClaimContext: ClaimContext;
        newLlmModelName: string;
        newMessages: Message[];
    }>) => {
        if (newClaimContext) {
            claimContext.setClaimContext(newClaimContext);
        }
        if (newLlmModelName) {
            setLlmModelName(newLlmModelName);
        }
        if (newMessages) {
            setMessages(newMessages);
        }
    };

    return {
        appendMessage,
        claimContext,
        llmApiClient,
        llmModelName,
        messages,
        setLlmModelName,
        setModel,
        streamResponse,
    };
}
