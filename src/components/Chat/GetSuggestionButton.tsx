import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";

import { Role } from "@custom-types";
import { ModelHook } from "@hooks/useModel";

interface GetSuggestionProps {
    model: ModelHook;
    appendToSuggestion: (text: string) => void;
    initializeSuggestion: () => void;
}

export default function GetSuggestionButton({
    model,
    appendToSuggestion,
    initializeSuggestion,
}: GetSuggestionProps) {
    async function streamSuggestion(): Promise<void> {
        model.setIsLoadingStream(true);

        try {
            await model.streamResponse(
                initializeSuggestion,
                appendToSuggestion
            );
        } catch (error) {
            console.error("Error fetching suggestion:", error);
        } finally {
            model.setIsLoadingStream(false);
        }
    }

    return (
        <>
            <Tooltip
                label={`New Suggestion: ${model.llmModelName}`}
                position="bottom"
            >
                <ActionIcon
                    color="violet"
                    disabled={model.isSuggestionDisabled()}
                    loading={model.isLoadingStream}
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
