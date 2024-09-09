import { useState } from 'react';
import ApiKeyLogin from "./components/ApiKeyLogin/ApiKeyLogin"
import Chat from './components/Chat/Chat'

export default function App() {
    const [apiKey, setApiKey] = useState("");
    const [isValidKey, setIsValidKey] = useState<boolean | undefined>(undefined);
    /* isValidKey:
        true: loads Chat component
        false: displays error message (incorrect API Key)
        undefined: no action taken yet (initial state, no error message)
    */

    // Updates the API Key (if provided) and the validity of the API Key
    const handleApiKeyChange = (newApiKey?: string, isValid?: boolean) => {
        if (newApiKey !== undefined) {
            setApiKey(newApiKey);
        }
        setIsValidKey(isValid);
    }

    return (
        <main>
            {!isValidKey
                ? <ApiKeyLogin
                    apiKey={apiKey}
                    isValidKey={isValidKey}
                    handleApiKeyChange={handleApiKeyChange}
                />
                : <Chat
                    apiKey={apiKey}
                />
            }
        </main>
    );
}
