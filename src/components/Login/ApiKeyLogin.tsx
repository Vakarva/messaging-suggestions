import { Button, Select, PasswordInput, Space } from "@mantine/core";

import { LlmProviderName } from "@custom-types";

interface ApiKeyLoginProps {
    apiKey: string;
    apiProviderName: LlmProviderName;
    editApiKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editApiProviderName: (value: string | null) => void;
    isLoading: boolean;
    isValidApiKey: boolean | undefined;
    submitApiKey: () => void;
}

export default function ApiKeyLogin({
    apiKey,
    apiProviderName,
    editApiKey,
    editApiProviderName,
    isLoading,
    isValidApiKey,
    submitApiKey,
}: ApiKeyLoginProps) {
    const errorMessage =
        isValidApiKey === false
            ? "Incorrect API Key: Please try again"
            : undefined;

    return (
        <>
            <Select
                allowDeselect={false}
                data={Object.values(LlmProviderName)}
                defaultValue={apiProviderName}
                disabled={isLoading}
                label="Provider"
                onChange={editApiProviderName}
            />
            <PasswordInput
                data-autofocus
                disabled={isLoading}
                error={errorMessage}
                label="API Key"
                name="apiKey"
                onChange={editApiKey}
                value={apiKey}
            />
            <Space h="md" />
            <Button
                disabled={apiKey.trim().length === 0}
                fullWidth
                loading={isLoading}
                onClick={submitApiKey}
            >
                Submit
            </Button>
        </>
    );
}
