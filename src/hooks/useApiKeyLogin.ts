import { useEffect, useState, useRef } from "react";

import {
    createLlmApiClient,
    LlmApiClient,
    LlmApiClientType,
    LlmProviderName,
} from "@custom-types";

export enum ApiKeyLoginStatus {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

export interface ApiKeyLoginHook {
    apiKey: string;
    apiProviderName: LlmProviderName;
    editApiKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editApiProviderName: (value: string | null) => void;
    llmApiClient: LlmApiClient<LlmApiClientType>;
    logout: () => void;
    status: ApiKeyLoginStatus;
    submitApiKey: () => void;
}

export default function useApiKeyLogin(): ApiKeyLoginHook {
    const [apiProviderName, setApiProviderName] = useState<LlmProviderName>(
        LlmProviderName.openAi
    );
    const [apiKey, setApiKey] = useState("");
    const [status, setStatus] = useState(ApiKeyLoginStatus.IDLE);

    const llmApiClientRef = useRef<LlmApiClient<LlmApiClientType>>(
        createLlmApiClient(apiProviderName, apiKey)
    );

    useEffect(() => {
        if (status !== ApiKeyLoginStatus.LOADING) return;

        const validateApiKey = async () => {
            llmApiClientRef.current = createLlmApiClient(
                apiProviderName,
                apiKey
            );

            const isValid = await llmApiClientRef.current.isApiKeyValid();
            setStatus(
                isValid ? ApiKeyLoginStatus.SUCCESS : ApiKeyLoginStatus.ERROR
            );
        };

        validateApiKey();
    }, [status]);

    const editApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
        setStatus(ApiKeyLoginStatus.IDLE);
    };

    const editApiProviderName = (value: string | null) => {
        setApiProviderName(value as LlmProviderName);
        setStatus(ApiKeyLoginStatus.IDLE);
    };

    const logout = () => {
        setApiKey("");
        setStatus(ApiKeyLoginStatus.IDLE);
    };

    const submitApiKey = () => {
        setStatus(ApiKeyLoginStatus.LOADING);
    };

    return {
        apiKey,
        apiProviderName,
        editApiKey,
        editApiProviderName,
        llmApiClient: llmApiClientRef.current,
        logout,
        status,
        submitApiKey,
    };
}
