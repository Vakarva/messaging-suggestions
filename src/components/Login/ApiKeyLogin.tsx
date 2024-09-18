import { Button, Select, PasswordInput, Space } from "@mantine/core";

import { LlmProviderName } from "@custom-types";
import { ApiSessionHook, ApiSessionStatus } from "@hooks/useApiSession";

export default function ApiKeyLogin({
    apiKey,
    apiProviderName,
    editApiKey,
    editApiProviderName,
    status,
    validateApiKey,
}: ApiSessionHook) {
    const isLoading = status === ApiSessionStatus.LOADING;

    return (
        <>
            <Select
                allowDeselect={false}
                data={Object.values(LlmProviderName)}
                disabled={isLoading}
                label="Provider"
                onChange={(value) =>
                    editApiProviderName(value as LlmProviderName)
                }
                value={apiProviderName}
            />
            <PasswordInput
                data-autofocus
                disabled={isLoading}
                error={
                    status === ApiSessionStatus.ERROR
                        ? "Incorrect API Key: Please try again"
                        : undefined
                }
                label="API Key"
                name="apiKey"
                onChange={(e) => editApiKey(e.target.value)}
                value={apiKey}
            />
            <Space h="md" />
            <Button
                disabled={apiKey.trim().length === 0}
                fullWidth
                loading={isLoading}
                onClick={validateApiKey}
            >
                Submit
            </Button>
        </>
    );
}
