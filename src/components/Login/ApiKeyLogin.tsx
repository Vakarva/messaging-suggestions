import { Button, Select, PasswordInput, Space } from "@mantine/core";
import { LLMProviderName } from "@custom-types";

interface ApiKeyLoginProps {
    apiKey: string;
    isValidKey: boolean | undefined;
    isSubmitting: boolean;
    providerName: LLMProviderName;
    setApiKey: (newApiKey: string) => void;
    setIsValidKey: (isValid?: boolean) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setProviderName: (providerName: LLMProviderName) => void;
}

export default function ApiKeyLogin({
    apiKey,
    isValidKey,
    isSubmitting,
    providerName,
    setApiKey,
    setIsSubmitting,
    setIsValidKey,
    setProviderName,
}: ApiKeyLoginProps) {
    const submitApiKey = async () => {
        setIsSubmitting(true);
    };

    return (
        <>
            <Select
                allowDeselect={false}
                data={Object.values(LLMProviderName)}
                defaultValue={providerName}
                label="Provider"
                onChange={(value) => setProviderName(value as LLMProviderName)}
            />
            <PasswordInput
                data-autofocus
                disabled={isSubmitting}
                error={
                    isValidKey === false
                        ? "Incorrect API Key: Please try again"
                        : undefined
                }
                label="API Key"
                name="apiKey"
                onChange={(e) => {
                    setApiKey(e.target.value);
                    setIsValidKey(undefined);
                }}
                value={apiKey}
            />
            <Space h="md" />
            <Button
                disabled={apiKey.trim().length === 0}
                fullWidth
                loading={isSubmitting}
                onClick={submitApiKey}
            >
                Submit
            </Button>
        </>
    );
}
