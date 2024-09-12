import { useEffect, useState } from "react";
import { ActionIcon, Group, Textarea, useMantineTheme } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
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
        <form onSubmit={handleSubmit}>
            <Textarea
                name={`${role}Message`}
                value={content}
                onChange={handleTextareaChange}
                variant="filled"
                styles={{ input: { backgroundColor: "transparent" } }}
            />
            <ActionIcon
                type="submit"
                disabled={content.trim() === ""} // disable if content is empty or only whitespace
                radius="xl"
                size="lg"
                mr="md"
                maw={30}
            >
                <IconArrowUp />
            </ActionIcon>
        </form>
    );
}
