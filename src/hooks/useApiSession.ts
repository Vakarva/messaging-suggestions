import { useRef, useState } from "react";

import {
    createLlmApiClient,
    LlmApiClient,
    LlmApiClientType,
    LlmProviderName,
} from "@custom-types";

export enum ApiSessionStatus {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

export interface ApiSessionHook {
    apiKey: string;
    apiProviderName: LlmProviderName;
    editApiKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editApiProviderName: (value: string | null) => void;
    client: LlmApiClient<LlmApiClientType>;
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

    const editApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
        if (status === ApiSessionStatus.ERROR) {
            setStatus(ApiSessionStatus.IDLE);
        }
    };

    const editApiProviderName = (value: string | null) => {
        setApiProviderName(value as LlmProviderName);
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

        const isValid = await clientRef.current.isApiKeyValid();
        setStatus(isValid ? ApiSessionStatus.SUCCESS : ApiSessionStatus.ERROR);
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
