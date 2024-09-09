import { useCallback, useEffect } from "react";
import { OpenAI } from "openai";
import "./ApiKeyLogin.css"

export default function ApiKeyLogin(props: {
    apiKey: string;
    isValidKey: boolean | undefined;
    handleApiKeyChange: (newApiKey: string | undefined, isValid: boolean | undefined) => void;
}) {
    // Move focus to the API Key input field on first render
    useEffect(() => {
        document.getElementById("api-key-form--input")?.focus();
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
            {props.isValidKey === false && (
                <div className="incorrect-key">
                    <p>Incorrect API Key: Please try again</p>
                </div>
            )}
            <div className="api-key-form">
                <label htmlFor="api-key">Enter OpenAI API Key:</label>
                <input
                    id="api-key-form--input"
                    className="api-key-form--input"
                    type="password"
                    name="apiKey"
                    value={props.apiKey}
                    onChange={(e) => props.handleApiKeyChange(e.target.value, undefined)}
                />
                <button
                    className="api-key-form--button"
                    onClick={submitApiKey}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}