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
    updateSettings: (settings: {
        newContext: ClaimContext;
        newName: string;
    }) => void;
}

export default function useLlm(): LlmHook {
    const apiSession = useApiSession();
    const context = useClaimContext();

    const updateSettings = ({
        newContext,
        newName,
    }: {
        newContext: ClaimContext;
        newName: string;
    }) => {
        context.set(newContext);
        apiSession.updateLlmName(newName);
    };

    return {
        apiSession,
        context,
        updateSettings,
    };
}
