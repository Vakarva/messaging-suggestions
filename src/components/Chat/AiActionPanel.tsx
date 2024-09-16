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
    onClick: () => void;
}

function ControlButton({
    icon: Icon,
    label,
    disabled,
    onClick,
}: ControlButtonProps) {
    const theme = useMantineTheme();

    return (
        <Tooltip label={label}>
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
    const controlItems = [
        {
            icon: IconArrowBackUp,
            label: "Undo suggestion",
            disabled: chat.form.isUndoDisabled,
            onClick: chat.form.undo,
        },
        {
            icon: IconArrowForwardUp,
            label: "Redo suggestion",
            disabled: chat.form.isRedoDisabled,
            onClick: chat.form.redo,
        },
    ];
    const controlButtons = controlItems.map((item) => (
        <ControlButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            disabled={item.disabled}
            onClick={item.onClick}
        />
    ));

    return (
        <Stack gap="xs" align="center">
            <Group gap="xs">{controlButtons}</Group>
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
        </Stack>
    );
}
