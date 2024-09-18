import { useEffect, useState } from "react";

import { Message } from "@custom-types";

import { ApiSessionHook, useApiSession } from "@hooks/useApiSession";
import { useClaimContext } from "@hooks/useClaimContext";
import { useChatForm } from "@hooks/useChatForm";

export interface LlmHook {
    apiSession: ApiSessionHook;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
}

export function useLlm(): LlmHook {
    const apiSession = useApiSession();
    const [name, setName] = useState<string>(
        apiSession.client.getDefaultModelName()
    );

    // new stuff
    // const context = useClaimContext();
    // const form = useChatForm();
    // const [isLoadingStream, _setIsLoadingStream] = useState(false);

    // const streamResponse = async (messages: Message[]): Promise<void> => {
    //     _setIsLoadingStream(true);
    //     const prompt = context.buildPrompt();
    //     try {
    //         const stream = await apiSession.client.getStream(
    //             prompt,
    //             messages,
    //             name
    //         );
    //         form.initialize();
    //         for await (const chunk of stream) {
    //             form.append(chunk);
    //         }
    //     } catch (error) {
    //         console.error("Error streaming LLM response:", error);
    //     } finally {
    //         _setIsLoadingStream(false);
    //     }
    // };
    // new stuff

    useEffect(() => {
        if (
            !apiSession.client
                .getAvailableModels()
                .find((modelName) => modelName === name)
        ) {
            setName(apiSession.client.getDefaultModelName());
        }
    }, [apiSession.client]);

    return {
        apiSession,
        name,
        setName,
    };
}
