import { useState } from "react";
import "./Chat.css";
import { Role, Message, LLMProvider } from "@custom-types";
import ChatInput from "@components/Chat/ChatInput/ChatInput";
import ChatHistory from "@components/Chat/ChatHistory/ChatHistory";
import Adjuster from "@components/Chat/Adjuster/Adjuster";

interface ChatProps {
    provider: LLMProvider;
}

export default function Chat({ provider }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    function addMessage(content: string, role: Role) {
        setMessages((oldMessages) => [
            ...oldMessages,
            { content, createdAt: new Date().toISOString(), role },
        ]);
    }

    return (
        <div className="chat">
            <div className="chat-history-container">
                <ChatHistory messages={messages} />
            </div>

            <div className="input-container">
                <div className="worker-input-container">
                    <ChatInput addMessage={addMessage} role={Role.user} />
                </div>

                <div className="adjuster-input-container">
                    <Adjuster
                        addMessage={addMessage}
                        messages={messages}
                        provider={provider}
                    />
                </div>
            </div>
        </div>
    );
}
