import { useState } from "react";

import { LlmHook, UiHook, useLlm, useUi } from "@hooks/index";

export interface ChatHook {
    isLoadingStream: boolean;
    llm: LlmHook;
    streamLlmResponse: () => Promise<void>;
    ui: UiHook;
}

export default function useChat(): ChatHook {
    const llm = useLlm();
    const [isLoadingStream, _setIsLoadingStream] = useState(false);
    const ui = useUi();

    const streamLlmResponse = async (): Promise<void> => {
        _setIsLoadingStream(true);
        const prompt = llm.context.getPrompt();
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

    return {
        isLoadingStream,
        llm,
        streamLlmResponse,
        ui,
    };
}
