import { useEffect, useState } from "react";

import {
    ApiSessionHook,
    ClaimContext,
    ClaimContextHook,
    useApiSession,
    useClaimContext,
} from "@hooks/index";

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

export default function useLlm(): LlmHook {
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
