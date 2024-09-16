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

    // TODO: confirm the dependency here is a good one...
    useEffect(() => {
        setModelName(apiSession.client.defaultModelName);
    }, [apiSession.client]);

    return {
        apiSession,
        modelName,
        setModelName,
    };
}
