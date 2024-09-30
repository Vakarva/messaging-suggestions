import { Button, Select, PasswordInput, Stack } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { LlmProviderName } from "@custom-types";
import { ApiSessionHook } from "@hooks/index";

export default function ApiKeyLogin({
    apiKey,
    apiProviderName,
    editApiKey,
    editApiProviderName,
    isError,
    isLoading,
    validateApiKey,
}: ApiSessionHook) {
    return (
        <Stack gap="md">
            <Stack gap={5}>
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
                        isError
                            ? "Incorrect API Key: Please try again"
                            : undefined
                    }
                    label="API Key"
                    name="apiKey"
                    onChange={(e) => editApiKey(e.target.value)}
                    onKeyDown={getHotkeyHandler([["Enter", validateApiKey]])}
                    value={apiKey}
                />
            </Stack>
            <Button
                disabled={apiKey.trim().length === 0}
                fullWidth
                loading={isLoading}
                onClick={validateApiKey}
            >
                Submit
            </Button>
        </Stack>
    );
}
