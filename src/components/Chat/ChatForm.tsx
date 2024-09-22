import { ActionIcon, Group, Textarea } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

import { Role } from "@custom-types";

import { AiActionPanel } from "@components/Chat/index";
import { ChatHook, TextSelection } from "@hooks/index";

import classes from "@styles/ChatForm.module.css";

interface ChatFormProps {
    chat: ChatHook;
}

const numRows = 3;

export default function ChatForm({ chat }: ChatFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        chat.sendMessage();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Group gap="sm">
                {chat.ui.input.role === Role.assistant && (
                    <AiActionPanel chat={chat} />
                )}

                <Textarea
                    aria-label="Message input"
                    autosize={true}
                    classNames={{
                        input:
                            chat.ui.input.textSelection === TextSelection.LLM
                                ? classes.llmTextarea
                                : undefined,
                    }}
                    maxRows={numRows}
                    minRows={numRows}
                    onChange={(e) => chat.ui.input.setText(e.target.value)}
                    onKeyDown={getHotkeyHandler([
                        ["mod+Enter", handleSubmit],
                        ["mod+Shift+Enter", chat.streamLlmResponse],
                        ["mod+/", chat.ui.input.toggleRole],
                        ["mod+Shift+,", chat.ui.input.undo],
                        ["mod+Shift+.", chat.ui.input.redo],
                    ])}
                    rightSection={
                        <ActionIcon
                            disabled={
                                chat.isLoadingStream || chat.ui.input.isEmpty
                            }
                            radius="xl"
                            size="lg"
                            type="submit"
                        >
                            <IconArrowUp />
                        </ActionIcon>
                    }
                    rightSectionWidth={50}
                    style={{ flexGrow: 1 }}
                    value={chat.ui.input.text}
                />
            </Group>
        </form>
    );
}
