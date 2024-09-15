import { useEffect, useMemo, useState, useRef } from "react";

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

    const llmApiClientRef = useRef<LlmApiClient<LlmApiClientType>>(
        createLlmApiClient(apiProviderName, apiKey)
    );

    useEffect(() => {
        if (!isLoading) return;

        (async () => {
            try {
                setIsLoading(true);
                llmApiClientRef.current = createLlmApiClient(
                    apiProviderName,
                    apiKey
                );
                setIsValidApiKey(await llmApiClientRef.current.isApiKeyValid());
            } finally {
                setIsLoading(false);
            }
        })();
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
        llmApiClient: llmApiClientRef.current,
        logout,
        isLoading,
        isValidApiKey,
        submitApiKey,
    };
}
