import { useEffect, useState } from "react";
import { ApiSessionHook, useApiSession } from "@hooks/useApiSession";

export interface LlmHook {
    apiSession: ApiSessionHook;
    modelName: string;
    setModelName: React.Dispatch<React.SetStateAction<string>>;
}

export function useLlm(): LlmHook {
    const apiSession = useApiSession();
    const [modelName, setModelName] = useState<string>(
        apiSession.client.getDefaultModelName()
    );

    useEffect(() => {
        if (
            !apiSession.client
                .getAvailableModels()
                .find((model) => model === modelName)
        ) {
            setModelName(apiSession.client.getDefaultModelName());
        }
    }, [apiSession.client]);

    return {
        apiSession,
        modelName,
        setModelName,
    };
}
