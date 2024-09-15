import {
    ActionIcon,
    Group,
    Stack,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";

import GetSuggestionButton from "@components/Chat/GetSuggestionButton";
import { ChatFormInputHook } from "@hooks/useChatFormInput";
import { ModelHook } from "@hooks/useModel";

interface AiToolbarProps {
    chatFormInput: ChatFormInputHook;
    model: ModelHook;
}

export default function AiToolbar({ chatFormInput, model }: AiToolbarProps) {
    const theme = useMantineTheme();
    const actionIconParams = {
        color: theme.colors.gray[7],
        onClick: chatFormInput.toggle,
        radius: "xl",
        size: "lg",
        variant: "filled",
    };
    const iconStyles = {
        stroke: 1.4,
        style: { width: "70%", height: "70%" },
    };

    return (
        <Stack gap="xs" align="center">
            <Group gap="xs">
                <Tooltip label="Undo suggestion">
                    <ActionIcon
                        {...actionIconParams}
                        disabled={chatFormInput.isUserButtonDisabled}
                    >
                        <IconArrowBackUp {...iconStyles} />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Redo suggestion">
                    <ActionIcon
                        {...actionIconParams}
                        disabled={chatFormInput.isLlmButtonDisabled}
                    >
                        <IconArrowForwardUp {...iconStyles} />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <GetSuggestionButton
                appendToSuggestion={chatFormInput.appendToSuggestion}
                initializeSuggestion={chatFormInput.initializeSuggestion}
                model={model}
            />
        </Stack>
    );
}
