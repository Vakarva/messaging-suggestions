import { useState } from "react";

import {
    ClaimContext,
    ClaimContextHook,
    useClaimContext,
} from "@hooks/useClaimContext";
import { MessagesHook, useMessages } from "@hooks/newuseMessages";
import { LlmHook, useLlm } from "@hooks/useLlm";

export interface OutputHandler {
    initialize: () => void;
    append: (text: string) => void;
}

export interface ChatHook {
    claimContext: ClaimContextHook;
    getLlmResponseStream: () => AsyncGenerator<string>;
    isLoadingStream: boolean;
    llm: LlmHook;
    messages: MessagesHook;
    streamResponse: (
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ) => Promise<void>;
    updateLlmSettings: ({
        newClaimContext,
        newLlmModelName,
    }: Partial<{
        newClaimContext: ClaimContext;
        newLlmModelName: string;
    }>) => void;
}

export function useChat(): ChatHook {
    const llm = useLlm();
    const claimContext = useClaimContext({});
    const messages = useMessages();

    const [isLoadingStream, setIsLoadingStream] = useState(false);

    async function* getLlmResponseStream(): AsyncGenerator<string> {
        setIsLoadingStream(true);
        const prompt = claimContext.buildSystemMessage();
        const responseStream = await llm.apiSession.client.getStream(
            prompt,
            messages.data,
            llm.modelName
        );

        for await (const chunk of responseStream) {
            yield chunk;
        }
        setIsLoadingStream(false);
    }

    // TODO: Deprecate this
    const streamResponse = async (
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ): Promise<void> => {
        setIsLoadingStream(true);
        const prompt = claimContext.buildSystemMessage();
        try {
            await llm.apiSession.client.writeStream(
                prompt,
                messages.data,
                llm.modelName,
                initializeOutput,
                appendToOutput
            );
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingStream(false);
        }
    };

    const updateLlmSettings = ({
        newClaimContext,
        newLlmModelName,
    }: Partial<{
        newClaimContext: ClaimContext;
        newLlmModelName: string;
    }>) => {
        if (newClaimContext) {
            claimContext.setClaimContext(newClaimContext);
        }
        if (newLlmModelName) {
            llm.setModelName(newLlmModelName);
        }
    };

    return {
        claimContext,
        getLlmResponseStream,
        isLoadingStream,
        llm,
        messages,
        streamResponse,
        updateLlmSettings,
    };
}
