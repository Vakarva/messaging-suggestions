import { Button, Select, PasswordInput, Space } from "@mantine/core";

import { LlmProviderName } from "@custom-types";
import { ApiKeyLoginHook, ApiKeyLoginStatus } from "@hooks/useApiKeyLogin";

export default function ApiKeyLogin({
    apiKey,
    apiProviderName,
    editApiKey,
    editApiProviderName,
    status,
    submitApiKey,
}: ApiKeyLoginHook) {
    const isLoading = status === ApiKeyLoginStatus.LOADING;

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
                error={
                    status === ApiKeyLoginStatus.ERROR
                        ? "Incorrect API Key: Please try again"
                        : undefined
                }
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
