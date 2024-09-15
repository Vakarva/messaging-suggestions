import { useEffect, useMemo, useState } from "react";

import {
    createLlmApiClient,
    LlmApiClient,
    LlmApiClientType,
    LlmProviderName,
} from "@custom-types";

export interface UseApiKeyLoginHook {
    apiKey: string;
    apiProviderName: LlmProviderName;
    editApiKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editApiProviderName: (value: string | null) => void;
    isLoading: boolean;
    isValidApiKey: boolean | undefined;
    llmApiClient: LlmApiClient<LlmApiClientType>;
    logout: () => void;
    submitApiKey: () => void;
}

export default function useApiKeyLogin(): UseApiKeyLoginHook {
    const [apiProviderName, setApiProviderName] = useState<LlmProviderName>(
        LlmProviderName.openAi
    );
    const [apiKey, setApiKey] = useState("");
    const [isValidApiKey, setIsValidApiKey] = useState<boolean | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState(false);

    const llmApiClient = useMemo(() => {
        return createLlmApiClient(apiProviderName, apiKey);
    }, [isLoading]);

    useEffect(() => {
        if (!isLoading) return;

        const validateApiKey = async () => {
            try {
                setIsLoading(true); // loading
                setIsValidApiKey(await llmApiClient.checkApiKey());
            } catch (error) {
                console.error(error);
                setIsValidApiKey(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateApiKey();
    }, [isLoading]);

    const editApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
        setIsValidApiKey(undefined);
    };

    const editApiProviderName = (value: string | null) => {
        setApiProviderName(value as LlmProviderName);
        setIsValidApiKey(undefined);
    };

    const logout = () => {
        setApiKey("");
        setIsValidApiKey(undefined);
    };

    const submitApiKey = () => {
        setIsLoading(true);
    };

    return {
        apiKey,
        apiProviderName,
        editApiKey,
        editApiProviderName,
        llmApiClient,
        logout,
        isLoading,
        isValidApiKey,
        submitApiKey,
    };
}
