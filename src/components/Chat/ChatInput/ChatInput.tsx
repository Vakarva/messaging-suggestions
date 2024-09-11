import { useEffect, useState } from "react";
import "./ChatInput.css";
import { Role } from "@custom-types";

interface ChatInputProps {
    addMessage: (content: string, role: Role) => void;
    insertedContent?: string;
    role: Role;
}
export default function ChatInput({
    addMessage,
    insertedContent,
    role,
}: ChatInputProps) {
    const [content, setContent] = useState("");

    const sendAs = role === Role.user ? "Worker" : "Adjuster";

    // If `insertedContent` is passed down, fill `content` with it
    useEffect(() => {
        if (insertedContent) {
            setContent(insertedContent);
        }
    }, [insertedContent]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        addMessage(content.trim(), role); // trim content of unnecessary whitespace before adding to conversation
        setContent(""); // clear the content box
    }

    function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(e.target.value);
    }

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <textarea
                className={`message-form--textarea message-form--textarea--${role}`}
                name={`${role}Message`}
                value={content}
                onChange={handleTextareaChange}
            />
            <button
                type="submit"
                disabled={content.trim() === ""} // disable if content is empty or only whitespace
            >
                Send as {sendAs}
            </button>
        </form>
    );
}
