import { useCallback, useEffect } from "react";
import "./ApiKeyLogin.css"

export default function ApiKeyLogin(props: {
    apiKey: string;
    isValidKey: boolean | null;
    handleApiKeyChange: (newApiKey: string, isValid: boolean | null) => void;
}) {
    useEffect(() => {
        document.getElementById("api-key-form--input")?.focus();
    }, []);

    const checkAPIKeyValidity = useCallback(async (apiKey: string): Promise<boolean> => {
        const url = "https://api.openai.com/v1/models";

        try {
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                return true;
            } else if (response.status === 401) {
                console.error("Invalid API Key");
                return false;
            } else {
                console.error("Error checking API Key:", response.status);
                return false;
            }
        } catch (error) {
            console.error("Network error or invalid request:", error);
            return false;
        }
    }, []);

    const submitApiKey = useCallback(async () => {
        const isValid = await checkAPIKeyValidity(props.apiKey);
        props.handleApiKeyChange(props.apiKey, isValid);
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
                    onChange={(e) => props.handleApiKeyChange(e.target.value, null)}
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