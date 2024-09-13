import { useState } from "react";
import { ActionIcon, AppShell, Drawer, useMantineTheme } from "@mantine/core";
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
    setModel: React.Dispatch<React.SetStateAction<string>>;
}

export default function Chat({
    context,
    provider,
    setContext,
    setModel,
}: ChatProps) {
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
        <AppShell header={{ height: 60 }} footer={{ height: 205 }} padding="lg">
            <AppShell.Header p="xs">
                <Drawer onClose={close} opened={opened} title="Settings">
                    <Settings
                        close={close}
                        context={context}
                        provider={provider}
                        setContext={setContext}
                        setModel={setModel}
                    />
                </Drawer>
                <ActionIcon
                    bg={theme.colors.gray[7]}
                    onClick={open}
                    size="xl"
                    variant="filled"
                >
                    <IconAdjustments />
                </ActionIcon>
            </AppShell.Header>
            <AppShell.Main bg={theme.colors.gray[0]}>
                <ChatHistory messages={messages} />
            </AppShell.Main>
            <AppShell.Footer p="md">
                <ToggleRole
                    addMessage={addMessage}
                    messages={messages}
                    provider={provider}
                />
            </AppShell.Footer>
        </AppShell>
    );
}
