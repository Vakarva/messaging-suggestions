import { useRef, useState } from "react";

import {
    createLlmApiClient,
    LlmApiClient,
    LlmProviderName,
} from "@custom-types";

enum ApiSessionStatus {
    ERROR,
    IDLE,
    LOADING,
    SUCCESS,
}

export interface ApiSessionHook {
    apiKey: string;
    apiProviderName: LlmProviderName;
    client: LlmApiClient;
    editApiKey: (newApiKey: string) => void;
    editApiProviderName: (newApiProviderName: LlmProviderName) => void;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    llmName: string;
    logout: () => void;
    updateLlmName: (name: string) => void;
    validateApiKey: () => Promise<void>;
}

export default function useApiSession(): ApiSessionHook {
    const [apiProviderName, setApiProviderName] = useState<LlmProviderName>(
        LlmProviderName.openAi
    );
    const [apiKey, setApiKey] = useState("");
    const [status, setStatus] = useState(ApiSessionStatus.IDLE);
    const [llmName, setLlmName] = useState<string>("");

    const clientRef = useRef(createLlmApiClient(apiProviderName, apiKey));

    const isError = status === ApiSessionStatus.ERROR;
    const isLoading = status === ApiSessionStatus.LOADING;
    const isSuccess = status === ApiSessionStatus.SUCCESS;

    const editApiKey = (newApiKey: string) => {
        setApiKey(newApiKey);
        if (isError) {
            setStatus(ApiSessionStatus.IDLE);
        }
    };

    const editApiProviderName = (newApiProviderName: LlmProviderName) => {
        setApiProviderName(newApiProviderName);
        if (isError) {
            setStatus(ApiSessionStatus.IDLE);
        }
    };

    const logout = () => {
        setApiKey("");
        setStatus(ApiSessionStatus.IDLE);
    };

    const validateApiKey = async () => {
        setStatus(ApiSessionStatus.LOADING);
        clientRef.current = createLlmApiClient(apiProviderName, apiKey);

        try {
            const client = clientRef.current;
            await client.validateApiKey();
            if (
                !client
                    .getAvailableModels()
                    .find((modelName) => modelName === llmName)
            ) {
                setLlmName(client.getDefaultModelName());
            }
            setStatus(ApiSessionStatus.SUCCESS);
        } catch (error) {
            console.error(error);
            setStatus(ApiSessionStatus.ERROR);
        }
    };

    return {
        apiKey,
        apiProviderName,
        client: clientRef.current,
        editApiKey,
        editApiProviderName,
        isError,
        isLoading,
        isSuccess,
        llmName,
        logout,
        updateLlmName: (name: string) => {
            setLlmName(name);
        },
        validateApiKey,
    };
}
