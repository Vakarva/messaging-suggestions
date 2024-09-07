import { useEffect, useState } from "react";
import "./ChatInput.css";
import { Role } from "../../../types/types";

export default function ChatInput(props: {
    addMessage: (content: string, role: Role) => void;
    role: Role;
    content?: string;
}) {
    const [content, setContent] = useState("");

    const sendAs = props.role === Role.user ? "Worker" : "Adjuster";

    // If `props.content` is passed down, fill `content` with it
    useEffect(() => {
        if (props.content) {
            setContent(props.content)
        }
    }, [props.content])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        props.addMessage(content.trim(), props.role);   // trim content of unnecessary whitespace before adding to conversation
        setContent(""); // clear the content box
    }

    function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit} className="message-form">
            <textarea
                name={`${props.role}Message`}
                value={content}
                onChange={handleTextareaChange}
            />
            <button
                type="submit"
                disabled={content.trim() === ""}    // disable if content is empty or only whitespace
            >
                Send as {sendAs}
            </button>
        </form>
    );
}