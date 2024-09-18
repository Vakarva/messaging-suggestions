import { ActionIcon, Group, Textarea } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

import { Role } from "@custom-types";

import AiActionPanel from "@components/Chat/AiActionPanel";
import { ChatHook } from "@hooks/useChat";

interface ChatFormProps {
    chat: ChatHook;
}

export default function ChatForm({ chat }: ChatFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        chat.ui.sendMessage();
        chat.ui.input.reset();
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
                    maxRows={4}
                    minRows={4}
                    onChange={(e) => chat.ui.input.setText(e.target.value)}
                    onKeyDown={getHotkeyHandler([
                        ["mod+Enter", handleSubmit],
                        [
                            "mod+Shift+Enter",
                            chat.ui.input.role === Role.assistant
                                ? chat.streamLlmResponse
                                : () => {},
                        ],
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
