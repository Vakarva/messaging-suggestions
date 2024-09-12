import { useEffect, useState } from "react";
import {
    ActionIcon,
    Group,
    Stack,
    Select,
    Textarea,
    Tooltip,
} from "@mantine/core";
import {
    IconArrowUp,
    IconArrowBackUp,
    IconArrowForwardUp,
} from "@tabler/icons-react";

import { LLMProvider, Message, Role } from "@custom-types";
import GetSuggestionButton from "@components/Chat/GetSuggestionButton";

interface ChatModuleProps {
    addMessage: (content: string, role: Role) => void;
    messages: Message[];
    provider: LLMProvider;
    role: Role;
}

export default function ChatModule({
    addMessage,
    messages,
    provider,
    role,
}: ChatModuleProps) {
    const [typedText, setTypedText] = useState("");
    const [isShowingSuggestion, setIsShowingSuggestion] = useState(true);
    const [suggestion, setSuggestion] = useState("");

    const displayText =
        suggestion && isShowingSuggestion ? suggestion : typedText;
    const isUndoButtonDisabled = !suggestion || !isShowingSuggestion;
    const isRedoButtonDisabled = !suggestion || isShowingSuggestion;

    // Reset the input and suggestion when the role changes
    useEffect(() => {
        setTypedText("");
        setSuggestion("");
    }, [role]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        addMessage(displayText.trim(), role); // trim text of unnecessary whitespace before adding to conversation
        setTypedText("");
        setSuggestion("");
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
                    autosize={true}
                    maxRows={4}
                    minRows={4}
                    onChange={(e) => setTypedText(e.target.value)}
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
