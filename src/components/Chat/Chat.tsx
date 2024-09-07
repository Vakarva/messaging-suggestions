import { useState } from 'react';
import { nanoid } from 'nanoid';
import './Chat.css';
import { Role, Message } from "../../types/types";
import ChatInput from "./ChatInput/ChatInput";
import Messages from "./Messages/Messages";
import AdjusterInput from "./AdjusterInput/AdjusterInput";

export default function Chat(props: {
    apiKey: string
}) {
    const [messages, setMessages] = useState<Message[]>([]);

    function addMessage(content: string, role: Role) {
        setMessages(oldMessages =>
            [...oldMessages, { id: nanoid(), content: content, role: role }]
        )
    }

    return (
        <div className="chat-container">
            <div>
                <ChatInput
                    addMessage={addMessage}
                    role={Role.user}
                />
            </div>
            <div>
                <Messages messages={messages} />
            </div>
            <div>
                <AdjusterInput
                    addMessage={addMessage}
                    apiKey={props.apiKey}
                />
            </div>
        </div>
    );
}