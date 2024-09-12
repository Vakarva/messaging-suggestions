import { ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrain } from "@tabler/icons-react";
import { LLMProvider, Message, Role } from "@custom-types";

interface GetSuggestionProps {
    messages: Message[];
    provider: LLMProvider;
    suggestion: string;
    setSuggestion: React.Dispatch<React.SetStateAction<string>>;
}

export default function GetSuggestionButton({
    messages,
    provider,
    suggestion,
    setSuggestion,
}: GetSuggestionProps) {
    const [isLoading, { open, close }] = useDisclosure(false);

    // Disable suggestion button if most recent message did not come from "user" (aka worker)
    const mostRecentRole = messages.length
        ? messages[messages.length - 1].role
        : null;
    const isSuggestionDisabled = mostRecentRole !== Role.user;

    // Get the LLMs suggested response
    async function getSuggestion() {
        setSuggestion(""); // clear previous suggestion (if it's still there) before starting a new stream
        open();

        try {
            await provider.getSuggestion(messages, setSuggestion);
        } catch (error) {
            console.error("Error fetching suggestion:", error);
            setSuggestion("Failed to get suggestion. Please try again.");
        } finally {
            close();
        }
    }

    return (
        <>
            <Tooltip
                label={`Generate ${
                    suggestion ? "new" : ""
                } suggested response: ${provider.model}`}
                multiline
                w={250}
            >
                <ActionIcon
                    disabled={isSuggestionDisabled}
                    loading={isLoading}
                    gradient={{ from: "violet", to: "cyan", deg: 135 }}
                    onClick={getSuggestion}
                    radius="xl"
                    size="xl"
                    variant="gradient"
                >
                    <IconBrain stroke={1.5} />
                </ActionIcon>
            </Tooltip>
        </>
    );
}
