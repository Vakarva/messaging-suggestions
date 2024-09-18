import { useState } from "react";

import {
    ClaimContext,
    ClaimContextHook,
    useClaimContext,
} from "@hooks/useClaimContext";

import { LlmHook, useLlm } from "@hooks/useLlm";
import { ChatFormHook, useChatForm } from "@hooks/useChatForm";

export interface OutputHandler {
    initialize: () => void;
    append: (text: string) => void;
}

export interface ChatHook {
    claimContext: ClaimContextHook;
    form: ChatFormHook;
    llm: LlmHook;
    isLoadingStream: boolean;
    streamLlmResponse: () => Promise<void>;
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
    const form = useChatForm();
    const [isLoadingStream, setIsLoadingStream] = useState(false);

    const streamLlmResponse = async (): Promise<void> => {
        setIsLoadingStream(true);
        const prompt = claimContext.buildSystemMessage();
        try {
            const stream = await llm.apiSession.client.getStream(
                prompt,
                form.messages.data,
                llm.modelName
            );
            form.initialize();
            for await (const chunk of stream) {
                form.append(chunk);
            }
        } catch (error) {
            console.error("Error fetching LLM response:", error);
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
        form,
        llm,
        isLoadingStream,
        streamLlmResponse,
        updateLlmSettings,
    };
}
