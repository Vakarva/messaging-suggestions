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

        chat.form.submit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Group gap="sm">
                {chat.form.role === Role.assistant && (
                    <AiActionPanel chat={chat} />
                )}

                <Textarea
                    aria-label="Message input"
                    autosize={true}
                    maxRows={4}
                    minRows={4}
                    onChange={(e) => chat.form.setText(e.target.value)}
                    onKeyDown={getHotkeyHandler([
                        ["mod+Enter", handleSubmit],
                        [
                            "mod+Shift+Enter",
                            chat.form.role === Role.assistant
                                ? chat.streamLlmResponse
                                : () => {},
                        ],
                        ["mod+/", chat.form.toggleRole],
                        ["mod+Shift+,", chat.form.undo],
                        ["mod+Shift+.", chat.form.redo],
                    ])}
                    rightSection={
                        <ActionIcon
                            disabled={chat.isLoadingStream || chat.form.isEmpty}
                            radius="xl"
                            size="lg"
                            type="submit"
                        >
                            <IconArrowUp />
                        </ActionIcon>
                    }
                    rightSectionWidth={50}
                    style={{ flexGrow: 1 }}
                    value={chat.form.text}
                />
            </Group>
        </form>
    );
}
