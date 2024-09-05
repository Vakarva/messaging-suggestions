import { useState } from 'react';
import './App.css';
import APIKeyLogin from './components/APIKeyLogin';
import Chat from './components/Chat'

export default function App() {
    const [apiKey, setApiKey] = useState("");

    return (
        <main>
            {!apiKey
                ? <APIKeyLogin
                    setApiKey={setApiKey}
                />
                : <Chat />
            }
        </main>
    );
}
