import { useEffect, useRef } from "react";
import classNames from "classnames";
import "./ChatHistory.css"
import { Role, Message } from "../../../types/types";

export default function ChatHistory(props: {
    messages: Message[];
}) {
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const messageElements = props.messages.map(message =>
        <div
            key={message.id}
            className={classNames("message-box", { "message-box--assistant": message.role == Role.assistant })}
        >
            {message.content}
        </div>
    );

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.messages]);

    return (
        <div className="chat-history">
            {messageElements}
            <div ref={chatEndRef} />
        </div>
    );
}