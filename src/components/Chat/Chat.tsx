import { useState } from 'react';
import './Chat.css';
import { Role, Message } from "../../types/types";
import ChatInput from "./ChatInput/ChatInput";
import ChatHistory from "./ChatHistory/ChatHistory";
import Adjuster from "./Adjuster/Adjuster";

export default function Chat(props: {
    apiKey: string
}) {
    const [messages, setMessages] = useState<Message[]>([]);

    function addMessage(content: string, role: Role) {
        setMessages(oldMessages =>
            [...oldMessages, { content, createdAt: new Date().toISOString(), role }]
        )
    }

    return (
        <div className="chat">
            <div className="chat-history-container">
                <ChatHistory messages={messages} />
            </div>

            <div className="input-container">
                <div className="worker-input-container">
                    <ChatInput
                        addMessage={addMessage}
                        role={Role.user}
                    />
                </div>

                <div className="adjuster-input-container">
                    <Adjuster
                        addMessage={addMessage}
                        apiKey={props.apiKey}
                        messages={messages}
                    />
                </div>
            </div>
        </div>
    );
}