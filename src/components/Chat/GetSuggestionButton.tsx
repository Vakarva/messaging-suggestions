import { ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
    const [isLoading, { open, close }] = useDisclosure(false);

    // Disable suggestion button if most recent message did not come from "user" (aka worker)
    const mostRecentRole = model.messages.length
        ? model.messages[model.messages.length - 1].role
        : null;
    const isSuggestionDisabled = mostRecentRole !== Role.user;

    async function streamSuggestion(): Promise<void> {
        open();

        try {
            model.streamResponse(initializeSuggestion, appendToSuggestion);
        } catch (error) {
            console.error("Error fetching suggestion:", error);
        } finally {
            close();
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
                    disabled={isSuggestionDisabled}
                    loading={isLoading}
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
