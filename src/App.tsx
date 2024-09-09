import { useState } from 'react';
import ApiKeyLogin from "./components/ApiKeyLogin/ApiKeyLogin"
import Chat from './components/Chat/Chat'

export default function App() {
    const [apiKey, setApiKey] = useState("");
    const [isValidKey, setIsValidKey] = useState<boolean | null>(null);

    const handleApiKeyChange = (newApiKey: string, isValid: boolean | null) => {
        setApiKey(newApiKey);
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
