import { useEffect, useState } from "react";
import { ActionIcon, Group, Stack, Textarea, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import {
    IconArrowBackUp,
    IconArrowForwardUp,
    IconArrowUp,
} from "@tabler/icons-react";

import { LLMProvider, Message, Role } from "@custom-types";

import GetSuggestionButton from "@components/Chat/GetSuggestionButton";

interface ChatInputProps {
    addMessage: (content: string, role: Role) => void;
    messages: Message[];
    provider: LLMProvider;
    role: Role;
}

export default function ChatInput({
    addMessage,
    messages,
    provider,
    role,
}: ChatInputProps) {
    const [isShowingSuggestion, setIsShowingSuggestion] = useState(true);
    const [suggestion, setSuggestion] = useState("");
    const [typedText, setTypedText] = useState("");

    const displayText =
        suggestion && isShowingSuggestion ? suggestion : typedText;
    const isRedoButtonDisabled = !suggestion || isShowingSuggestion;
    const isUndoButtonDisabled = !suggestion || !isShowingSuggestion;

    // Reset the input and suggestion when the role changes
    useEffect(() => {
        setSuggestion("");
        setTypedText("");
    }, [role]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        addMessage(displayText.trim(), role); // trim text of unnecessary whitespace before adding to conversation
        setSuggestion("");
        setTypedText("");
        setIsShowingSuggestion(true);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Group gap="sm">
                {role === Role.assistant && (
                    <Stack gap="xs" align="center">
                        <Group gap="xs">
                            <Tooltip label="Undo suggestion">
                                <ActionIcon
                                    color="gray"
                                    disabled={isUndoButtonDisabled}
                                    onClick={() =>
                                        setIsShowingSuggestion(false)
                                    }
                                    variant="filled"
                                >
                                    <IconArrowBackUp />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Redo suggestion">
                                <ActionIcon
                                    color="gray"
                                    disabled={isRedoButtonDisabled}
                                    onClick={() => setIsShowingSuggestion(true)}
                                    variant="filled"
                                >
                                    <IconArrowForwardUp />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        <GetSuggestionButton
                            messages={messages}
                            provider={provider}
                            setSuggestion={setSuggestion}
                            suggestion={suggestion}
                        />
                    </Stack>
                )}

                <Textarea
                    aria-label="Message input"
                    autosize={true}
                    maxRows={4}
                    minRows={4}
                    onChange={(e) => setTypedText(e.target.value)}
                    onKeyDown={getHotkeyHandler([["mod+Enter", handleSubmit]])}
                    rightSection={
                        <ActionIcon
                            type="submit"
                            disabled={displayText.trim() === ""} // disable if content is empty or only whitespace
                            radius="xl"
                            size="lg"
                        >
                            <IconArrowUp />
                        </ActionIcon>
                    }
                    rightSectionWidth={50}
                    style={{ flexGrow: 1 }}
                    value={displayText}
                />
            </Group>
        </form>
    );
}
