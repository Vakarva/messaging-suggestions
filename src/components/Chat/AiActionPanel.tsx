import {
    ActionIcon,
    Group,
    Stack,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import {
    IconArrowBackUp,
    IconArrowForwardUp,
    IconBrain,
} from "@tabler/icons-react";

import { ChatHook } from "@hooks/useChat";

interface ControlButtonProps {
    icon: typeof IconArrowBackUp;
    label: string;
    disabled: boolean;
    openDelay?: number;
    onClick: () => void;
}

function ControlButton({
    icon: Icon,
    label,
    disabled,
    openDelay,
    onClick,
}: ControlButtonProps) {
    const theme = useMantineTheme();

    return (
        <Tooltip label={label} openDelay={openDelay}>
            <ActionIcon
                color={theme.colors.gray[7]}
                disabled={disabled}
                onClick={onClick}
                radius="xl"
                size="lg"
                variant="filled"
            >
                <Icon stroke={1.4} style={{ width: "70%", height: "70%" }} />
            </ActionIcon>
        </Tooltip>
    );
}

interface AiActionPanelProps {
    chat: ChatHook;
}

export default function AiActionPanel({ chat }: AiActionPanelProps) {
    const openDelay = 300;
    const controlItems = [
        {
            icon: IconArrowBackUp,
            label: "Undo suggestion",
            disabled: chat.ui.input.isUndoDisabled,
            onClick: chat.ui.input.undo,
        },
        {
            icon: IconArrowForwardUp,
            label: "Redo suggestion",
            disabled: chat.ui.input.isRedoDisabled,
            onClick: chat.ui.input.redo,
        },
    ];
    const controlButtons = controlItems.map((item) => (
        <ControlButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            disabled={item.disabled}
            openDelay={openDelay}
            onClick={item.onClick}
        />
    ));

    return (
        <Stack gap="xs" align="center">
            <Group gap="xs">{controlButtons}</Group>
            <Tooltip
                label={`New Suggestion: ${chat.llm.name}`}
                openDelay={openDelay}
                position="bottom"
            >
                <ActionIcon
                    color="violet"
                    disabled={chat.ui.output.isSuggestionDisabled}
                    loading={chat.isLoadingStream}
                    onClick={chat.streamLlmResponse}
                    radius="xl"
                    size="xl"
                    variant="filled"
                >
                    <IconBrain stroke={1.5} />
                </ActionIcon>
            </Tooltip>
        </Stack>
    );
}
