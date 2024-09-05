import { useState, useRef } from "react";

interface APIKeyLoginProps {
    setApiKey: (apiKey: string) => void;
}

export default function APIKeyLogin(props: APIKeyLoginProps) {
    const [isValidKey, setIsValidKey] = useState<boolean | null>(null);

    const apiKeyRef = useRef<HTMLInputElement>(null);

    async function checkAPIKeyValidity(apiKey: string): Promise<boolean> {
        const url = "https://api.openai.com/v1/models"; // Test with the models endpoint

        try {
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // API key is valid
                return true;
            } else if (response.status === 401) {
                // API key is invalid
                console.error("Invalid API Key");
                return false;
            } else {
                // Handle other error statuses
                console.error("Error checking API Key:", response.status);
                return false;
            }
        } catch (error) {
            console.error("Network error or invalid request:", error);
            return false;
        }
    }

    async function submitApiKey() {
        const apiKey = apiKeyRef.current?.value ?? ""; // Access the input value via the ref
        const isValid = await checkAPIKeyValidity(apiKey);
        setIsValidKey(isValid);

        if (isValid) {
            props.setApiKey(apiKey);
        }
    }

    return (
        <div className="apiKey-container">
            {isValidKey === false &&
                <div className="incorrect-key">
                    <p>Incorrect API Key: Please try again</p>
                </div>
            }
            <div className="apiKey-form">
                <label htmlFor="api-key">OpenAI API Key:</label>
                <input
                    id="api-key"
                    type="password"
                    name="apiKey"
                    ref={apiKeyRef}
                />
                <button
                    className="apiKey-form--button"
                    onClick={submitApiKey}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}