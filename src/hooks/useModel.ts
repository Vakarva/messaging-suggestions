import { useEffect, useState } from "react";

import { LlmApiClient, LlmApiClientType, Message, Role } from "@custom-types";
import {
    ClaimContext,
    ClaimContextHook,
    useClaimContext,
} from "@hooks/useClaimContext";

export interface ModelHook {
    appendMessage: (content: string, role: Role) => void;
    claimContext: ClaimContextHook;
    isLoadingStream: boolean;
    isSuggestionDisabled: () => boolean;
    llmApiClient: LlmApiClient<LlmApiClientType>;
    llmModelName: string;
    messages: Message[];
    setIsLoadingStream: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [isLoadingStream, setIsLoadingStream] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setLlmModelName(llmApiClient.defaultModelName);
    }, [llmApiClient]);

    const appendMessage = (content: string, role: Role) => {
        setMessages((oldMessages) => [
            ...oldMessages,
            { content, createdAt: new Date(), role },
        ]);
    };

    const isSuggestionDisabled = () => {
        const mostRecentRole = messages.at(-1)?.role;
        return mostRecentRole !== Role.user;
    };

    const streamResponse = async (
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ): Promise<void> => {
        const prompt = claimContext.buildSystemMessage();
        try {
            await llmApiClient.writeStream(
                prompt,
                messages,
                llmModelName,
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
        isLoadingStream,
        isSuggestionDisabled,
        llmApiClient,
        llmModelName,
        messages,
        setIsLoadingStream,
        setLlmModelName,
        setModel,
        streamResponse,
    };
}
