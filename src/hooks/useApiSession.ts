import { useRef, useState } from "react";

import {
    createLlmApiClient,
    LlmApiClient,
    LlmProviderName,
} from "@custom-types";

export enum ApiSessionStatus {
    ERROR,
    IDLE,
    LOADING,
    SUCCESS,
}

export interface ApiSessionHook {
    apiKey: string;
    apiProviderName: LlmProviderName;
    editApiKey: (newApiKey: string) => void;
    editApiProviderName: (newApiProviderName: LlmProviderName) => void;
    client: LlmApiClient;
    logout: () => void;
    status: ApiSessionStatus;
    validateApiKey: () => Promise<void>;
}

export function useApiSession(): ApiSessionHook {
    const [apiProviderName, setApiProviderName] = useState<LlmProviderName>(
        LlmProviderName.openAi
    );
    const [apiKey, setApiKey] = useState("");
    const [status, setStatus] = useState(ApiSessionStatus.IDLE);

    const clientRef = useRef(createLlmApiClient(apiProviderName, apiKey));

    const editApiKey = (newApiKey: string) => {
        setApiKey(newApiKey);
        if (status === ApiSessionStatus.ERROR) {
            setStatus(ApiSessionStatus.IDLE);
        }
    };

    const editApiProviderName = (newApiProviderName: LlmProviderName) => {
        setApiProviderName(newApiProviderName);
        if (status === ApiSessionStatus.ERROR) {
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
            await clientRef.current.validateApiKey();
            setStatus(ApiSessionStatus.SUCCESS);
        } catch (error) {
            console.error(error);
            setStatus(ApiSessionStatus.ERROR);
        }
    };

    return {
        apiKey,
        apiProviderName,
        editApiKey,
        editApiProviderName,
        client: clientRef.current,
        logout,
        status,
        validateApiKey,
    };
}
