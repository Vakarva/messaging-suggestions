import { useEffect, useMemo, useState } from "react";
import { Modal } from "@mantine/core";

import {
    ClaimContext,
    createLLMProvider,
    LLMProviderName,
} from "@custom-types";

import ApiKeyLogin from "@components/ApiKeyLogin/ApiKeyLogin";
import Chat from "@components/Chat/Chat";

export default function App() {
    const [apiKey, setApiKey] = useState("");
    const [context, setContext] = useState<ClaimContext>(
        () => new ClaimContext()
    );
    const [isValidKey, setIsValidKey] = useState<boolean | undefined>(
        undefined
    );
    /* isValidKey:
        true: loads Chat component
        false: displays error message (incorrect API Key)
        undefined: no action taken yet (initial state, no error message)
    */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [model, setModel] = useState<string>("gpt-4o-mini");
    const [providerName, setProviderName] = useState<LLMProviderName>(
        LLMProviderName.openai
    );

    const provider = useMemo(() => {
        try {
            return createLLMProvider(providerName, apiKey, context, model);
        } catch (error) {
            console.error(error);
            return createLLMProvider(providerName, "", context, model);
        }
    }, [context, isSubmitting, model]);

    useEffect(() => {
        if (!isSubmitting) return;

        const validateApiKey = async () => {
            try {
                const isValid = await provider.checkApiKey();
                setIsValidKey(isValid);
            } catch (error) {
                console.error(error);
                setIsValidKey(false); // key is invalid
            } finally {
                setIsSubmitting(false);
            }
        };

        validateApiKey();
    }, [isSubmitting]);

    return (
        <main>
            <Modal
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                onClose={() => {}}
                opened={!isValidKey}
                overlayProps={{
                    blur: 3,
                }}
                size="xs"
                styles={{
                    title: {
                        fontWeight: "bold",
                        margin: "0",
                        padding: "0",
                    },
                }}
                title="Enter API Key"
                withCloseButton={false}
            >
                <ApiKeyLogin
                    apiKey={apiKey}
                    isValidKey={isValidKey}
                    isSubmitting={isSubmitting}
                    providerName={providerName}
                    setApiKey={setApiKey}
                    setIsSubmitting={setIsSubmitting}
                    setIsValidKey={setIsValidKey}
                    setProviderName={setProviderName}
                />
            </Modal>

            <Chat
                context={context}
                provider={provider}
                setContext={setContext}
                setModel={setModel}
            />
        </main>
    );
}
