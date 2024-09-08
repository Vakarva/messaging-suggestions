import { useState } from 'react';
import ApiKeyLogin from "./components/ApiKeyLogin/ApiKeyLogin"
import Chat from './components/Chat/Chat'

export default function App() {
    const [apiKey, setApiKey] = useState("");

    return (
        <main>
            {!apiKey
                ? <ApiKeyLogin setApiKey={setApiKey} />
                : <Chat apiKey={apiKey} />
            }
        </main>
    );
}
