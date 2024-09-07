import classNames from "classnames";
import "./Messages.css"
import { Role, Message } from "../../../types/types";

export default function Messages(props: {
    messages: Message[];
}) {

    const messageElements = props.messages.map(message =>
        <div
            key={message.id}
            className={classNames("message-box", { "message-box--user": message.role == Role.user })}
        >
            {message.content}
        </div>
    );

    return (
        <div className="messages">
            {messageElements}
        </div>
    );
}