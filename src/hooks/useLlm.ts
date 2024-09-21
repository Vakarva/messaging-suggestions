import { useEffect, useState } from "react";

import { ApiSessionHook, useApiSession } from "@hooks/useApiSession";
import {
    ClaimContext,
    ClaimContextHook,
    useClaimContext,
} from "@hooks/useClaimContext";

export interface LlmHook {
    apiSession: ApiSessionHook;
    context: ClaimContextHook;
    name: string;
    updateSettings: (
        settings: Partial<{
            newContext: ClaimContext;
            newName: string;
        }>
    ) => void;
}

export function useLlm(): LlmHook {
    const apiSession = useApiSession();
    const context = useClaimContext();
    const [name, setName] = useState<string>(
        apiSession.client.getDefaultModelName()
    );

    const updateSettings = ({
        newContext,
        newName,
    }: Partial<{
        newContext: ClaimContext;
        newName: string;
    }>) => {
        if (newContext) {
            context.set(newContext);
        }
        if (newName) {
            setName(newName);
        }
    };

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
        context,
        name,
        updateSettings,
    };
}
