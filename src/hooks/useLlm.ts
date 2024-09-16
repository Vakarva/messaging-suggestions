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
        apiSession.client.defaultModelName
    );

    useEffect(() => {
        if (
            !apiSession.client.availableModels.find(
                (model) => model === modelName
            )
        ) {
            setModelName(apiSession.client.defaultModelName);
        }
    }, [apiSession.client]);

    return {
        apiSession,
        modelName,
        setModelName,
    };
}
