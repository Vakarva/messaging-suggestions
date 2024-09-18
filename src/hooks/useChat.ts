import { useState } from "react";

import { Message } from "@custom-types";

import {
    ClaimContext,
    ClaimContextHook,
    useClaimContext,
} from "@hooks/useClaimContext";
import { LlmHook, useLlm } from "@hooks/useLlm";
import { ChatFormHook, useChatForm } from "@hooks/useChatForm";

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
    const claimContext = useClaimContext();
    const form = useChatForm();
    const [isLoadingStream, _setIsLoadingStream] = useState(false);

    const messages: Message[] = JSON.parse(
        localStorage.getItem("messages") ?? "[]"
    );

    const streamLlmResponse = async (): Promise<void> => {
        _setIsLoadingStream(true);
        const prompt = claimContext.buildPrompt();
        try {
            const stream = await llm.apiSession.client.getStream(
                prompt,
                form.messages.data,
                llm.name
            );
            form.initialize();
            for await (const chunk of stream) {
                form.append(chunk);
            }
        } catch (error) {
            console.error("Error streaming LLM response:", error);
        } finally {
            _setIsLoadingStream(false);
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
            claimContext.set(newClaimContext);
        }
        if (newLlmModelName) {
            llm.setName(newLlmModelName);
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
