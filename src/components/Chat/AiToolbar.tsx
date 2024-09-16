import {
    ActionIcon,
    Group,
    Stack,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";

import GetSuggestionButton from "@components/Chat/GetSuggestionButton";
import { ChatHook } from "@hooks/useChat";

interface AiToolbarProps {
    chat: ChatHook;
}

export default function AiToolbar({ chat }: AiToolbarProps) {
    const theme = useMantineTheme();
    const actionIconParams = {
        color: theme.colors.gray[7],
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
                        disabled={chat.form.isUndoDisabled}
                        onClick={chat.form.undo}
                    >
                        <IconArrowBackUp {...iconStyles} />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Redo suggestion">
                    <ActionIcon
                        {...actionIconParams}
                        disabled={chat.form.isRedoDisabled}
                        onClick={chat.form.redo}
                    >
                        <IconArrowForwardUp {...iconStyles} />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <GetSuggestionButton chat={chat} chatForm={chat.form} />
        </Stack>
    );
}
