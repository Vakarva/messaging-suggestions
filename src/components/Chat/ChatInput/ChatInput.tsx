import { useState } from "react";
import "./ChatInput.css";
import { Role } from "../../../types/types";

export default function ChatInput(props: {
    addMessage: (content: string, role: Role) => void;
    role: Role;
}) {
    const [content, setContent] = useState("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        props.addMessage(content, props.role);
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
                disabled={content.trim() === ""}    // Check if white-space trimmed message is empty
            >
                Send
            </button>
        </form>
    );
}