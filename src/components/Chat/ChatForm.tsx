import { useEffect } from "react";
import { ActionIcon, Group, Textarea } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

import { Role } from "@custom-types";

import AiToolbar from "@components/Chat/AiToolbar";
import { useChatFormInput } from "@hooks/useChatFormInput";
import { ModelHook } from "@hooks/useModel";

interface ChatFormProps {
    model: ModelHook;
    role: Role;
}

export default function ChatForm({ model, role }: ChatFormProps) {
    const chatFormInput = useChatFormInput();

    // Clear inputs when the role changes
    useEffect(chatFormInput.reset, [role]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        model.appendMessage(chatFormInput.text.trim(), role); // trim text before adding to conversation
        chatFormInput.reset();
    }

    return (
        <form onSubmit={handleSubmit}>
            <Group gap="sm">
                {role === Role.assistant && (
                    <AiToolbar chatFormInput={chatFormInput} model={model} />
                )}

                <Textarea
                    aria-label="Message input"
                    autosize={true}
                    maxRows={4}
                    minRows={4}
                    onChange={chatFormInput.setText}
                    onKeyDown={getHotkeyHandler([["mod+Enter", handleSubmit]])}
                    rightSection={
                        <ActionIcon
                            disabled={
                                model.isLoadingStream ||
                                chatFormInput.text.trim() === ""
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
                    value={chatFormInput.text}
                />
            </Group>
        </form>
    );
}
