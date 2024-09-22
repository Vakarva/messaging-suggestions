import { useState } from "react";

import { Role } from "@custom-types";

import { LlmHook, UiHook, useLlm, useUi } from "@hooks/index";

export interface ChatHook {
    isLoadingStream: boolean;
    llm: LlmHook;
    sendMessage: () => void;
    streamLlmResponse: () => Promise<void>;
    ui: UiHook;
}

export default function useChat(): ChatHook {
    const llm = useLlm();
    const [isLoadingStream, _setIsLoadingStream] = useState(false);
    const ui = useUi();

    const sendMessage = () => {
        if (!ui.input.isEmpty && !isLoadingStream) {
            ui.output.append(ui.input.text.trim(), ui.input.role);
            ui.input.reset();
        }
    };

    const streamLlmResponse = async (): Promise<void> => {
        if (
            ui.input.role === Role.assistant &&
            !ui.output.isSuggestionDisabled
        ) {
            _setIsLoadingStream(true);
            const prompt = llm.context.buildPrompt();
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
        }
    };

    return {
        isLoadingStream,
        llm,
        sendMessage,
        streamLlmResponse,
        ui,
    };
}
