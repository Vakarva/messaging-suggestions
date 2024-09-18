import { useState } from "react";

import {
    ClaimContext,
    ClaimContextHook,
    useClaimContext,
} from "@hooks/useClaimContext";
import { LlmHook, useLlm } from "@hooks/useLlm";
import { UiHook, useUi } from "@hooks/useUi";

export interface ChatHook {
    claimContext: ClaimContextHook;
    ui: UiHook;
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
    const ui = useUi();
    const [isLoadingStream, _setIsLoadingStream] = useState(false);

    const streamLlmResponse = async (): Promise<void> => {
        _setIsLoadingStream(true);
        const prompt = claimContext.buildPrompt();
        try {
            const stream = await llm.apiSession.client.getStream(
                prompt,
                ui.output.messages,
                llm.name
            );
            ui.input.initialize();
            for await (const chunk of stream) {
                ui.input.append(chunk);
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
        ui,
        llm,
        isLoadingStream,
        streamLlmResponse,
        updateLlmSettings,
    };
}
