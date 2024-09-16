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

    // TODO: confirm that the dependency here is a wise choice
    useEffect(() => {
        setModelName(apiSession.client.defaultModelName);
    }, [apiSession.client]);

    return {
        apiSession,
        modelName,
        setModelName,
    };
}
