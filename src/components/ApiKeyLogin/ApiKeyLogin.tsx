import { useCallback, useEffect, useRef } from "react";
import { Button, Input } from "@mantine/core";
import { OpenAI } from "openai";
import "./ApiKeyLogin.css"

export default function ApiKeyLogin(props: {
    apiKey: string;
    handleApiKeyChange: (newApiKey?: string, isValid?: boolean) => void;
    isValidKey: boolean | undefined;
}) {
    const apiKeyInputRef = useRef<HTMLInputElement>(null);

    // Move focus to the API Key input field on first render
    useEffect(() => {
        apiKeyInputRef.current?.focus();
    }, []);

    // Check if the API Key is valid by making a free request (listing models) to the OpenAI API
    const checkAPIKeyValidity = useCallback(async (apiKey: string): Promise<boolean> => {
        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });

        try {
            const response = await openai.models.list();
            return response.data.length > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, []);

    // Check if the API Key is valid
    const submitApiKey = useCallback(async () => {
        const isValid = await checkAPIKeyValidity(props.apiKey);
        props.handleApiKeyChange(undefined, isValid);   // apiKey is already stored in state, so pass undefined
    }, [props.apiKey, checkAPIKeyValidity]);

    return (
        <div className="api-key-container">
            <div className="api-key-form">
                <Input.Wrapper
                    error={props.isValidKey === false ? "Incorrect API Key: Please try again" : undefined}
                    label="API Key"
                >
                    <Input
                        className="api-key-form--input"
                        id="api-key-form--input"
                        name="apiKey"
                        onChange={(e) => props.handleApiKeyChange(e.target.value, undefined)}
                        ref={apiKeyInputRef}
                        type="password"
                        value={props.apiKey}
                    />
                </Input.Wrapper>
                <Button
                    className="api-key-form--button"
                    onClick={submitApiKey}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}