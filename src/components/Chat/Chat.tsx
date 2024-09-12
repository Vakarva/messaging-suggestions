import { useState } from "react";
import {
    ActionIcon,
    AppShell,
    Box,
    Drawer,
    Stack,
    useMantineTheme,
} from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import { ClaimContext, Role, Message, LLMProvider } from "@custom-types";

import ChatHistory from "@components/Chat/ChatHistory";
import ToggleRole from "@components/Chat/ToggleRole";
import Settings from "@components/Chat/Settings";

interface ChatProps {
    context: ClaimContext;
    provider: LLMProvider;
    setContext: React.Dispatch<React.SetStateAction<ClaimContext>>;
}

export default function Chat({ context, provider, setContext }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [opened, { open, close }] = useDisclosure(false);

    const theme = useMantineTheme();

    function addMessage(content: string, role: Role) {
        setMessages((oldMessages) => [
            ...oldMessages,
            { content, createdAt: new Date(), role },
        ]);
    }

    return (
        <AppShell padding="md" header={{ height: 60 }}>
            <AppShell.Header p="xs">
                <Drawer opened={opened} onClose={close} title="Settings">
                    <Settings
                        close={close}
                        context={context}
                        setContext={setContext}
                    />
                </Drawer>
                <ActionIcon
                    bg={theme.colors.gray[8]}
                    onClick={open}
                    variant="filled"
                    size="xl"
                >
                    <IconAdjustments />
                </ActionIcon>
            </AppShell.Header>
            <AppShell.Main bg={theme.colors.gray[0]}>
                <Stack justify="space-between">
                    <ChatHistory messages={messages} />

                    <Box>
                        <ToggleRole
                            addMessage={addMessage}
                            messages={messages}
                            provider={provider}
                        />
                    </Box>
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}
