import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";

import { ChatHook } from "@hooks/useChat";
import { ChatFormHook } from "@hooks/useChatForm";

interface GetSuggestionProps {
    chat: ChatHook;
    chatForm: ChatFormHook;
}

export default function GetSuggestionButton({ chat }: GetSuggestionProps) {
    async function streamSuggestion(): Promise<void> {
        await chat.streamLlmResponse();
    }

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
                    onClick={streamSuggestion}
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

// await chatForm.streamSuggestion(await chat.getLlmResponseStream());

// chat.setIsLoadingStream(true);
// chatForm.initializeSuggestion();
// const stream = await chat.getLlmResponseStream();
// for await (const text of stream) {
//     chatForm.appendToSuggestion(text);
// }
// chat.setIsLoadingStream(false);

// await chat.streamResponse(initializeSuggestion, appendToSuggestion);

// model.setIsLoadingStream(true);

// try {
//     await model.streamResponse(
//         initializeSuggestion,
//         appendToSuggestion
//     );
// } catch (error) {
//     console.error("Error fetching suggestion:", error);
// } finally {
//     model.setIsLoadingStream(false);
// }
