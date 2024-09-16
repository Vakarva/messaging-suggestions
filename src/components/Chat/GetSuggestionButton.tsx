import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";

import { ChatHook } from "@hooks/useChat";
import { ChatFormHook } from "@hooks/useChatForm";

interface GetSuggestionProps {
    chat: ChatHook;
    chatForm: ChatFormHook;
}

export default function GetSuggestionButton({ chat }: GetSuggestionProps) {
    return (
        <>
            <Tooltip
                label={`New Suggestion: ${chat.llm.modelName}`}
                position="bottom"
            >
                <ActionIcon
                    color="violet"
                    disabled={chat.form.messages.isSuggestionDisabled}
                    loading={chat.isLoadingStream}
                    onClick={chat.streamLlmResponse}
                    radius="xl"
                    size="xl"
                    variant="filled"
                >
                    <IconBrain stroke={1.5} />
                </ActionIcon>
            </Tooltip>
        </>
    );
}
