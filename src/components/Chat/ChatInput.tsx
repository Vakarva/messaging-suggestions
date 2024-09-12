import { useEffect, useState } from "react";
import {
    ActionIcon,
    Group,
    Select,
    Textarea,
    Tooltip,
    useMantineTheme,
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
    const isAssistant = role === Role.assistant;

    const theme = useMantineTheme();

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
        <>
            {isAssistant && (
                <Group gap="xs">
                    <Tooltip label="Undo suggestion">
                        <ActionIcon
                            color="gray"
                            disabled={isUndoButtonDisabled}
                            onClick={() => setIsShowingSuggestion(false)}
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
            )}
            <form onSubmit={handleSubmit}>
                <Group
                    bg={theme.white}
                    grow
                    preventGrowOverflow={false}
                    styles={{
                        root: {
                            border: `1px solid ${theme.colors.gray[4]}`,
                            borderRadius: theme.radius.md,
                        },
                    }}
                >
                    {isAssistant && (
                        <GetSuggestionButton
                            messages={messages}
                            provider={provider}
                            suggestion={suggestion}
                            setSuggestion={setSuggestion}
                        />
                    )}
                    <Textarea
                        autosize={true}
                        value={displayText}
                        minRows={4}
                        maxRows={4}
                        onChange={(e) => setTypedText(e.target.value)}
                        variant="filled"
                        styles={{ input: { backgroundColor: "transparent" } }}
                    />
                    <ActionIcon
                        type="submit"
                        disabled={displayText.trim() === ""} // disable if content is empty or only whitespace
                        radius="xl"
                        size="lg"
                        mr="md"
                        maw={30}
                    >
                        <IconArrowUp />
                    </ActionIcon>
                </Group>
            </form>
        </>
    );
}
