import { AppShell, Burger, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import ChatHistory from "@components/Chat/ChatHistory";
import Navbar from "@components/Chat/Navbar";
import RoleTabs from "@components/Chat/RoleTabs";

import { ChatHook } from "@hooks/useChat";

interface ChatProps {
    chat: ChatHook;
}

export default function Chat({ chat }: ChatProps) {
    const [opened, { toggle }] = useDisclosure(false);

    const theme = useMantineTheme();

    return (
        <AppShell
            layout="alt"
            navbar={{
                width: 80,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            footer={{ height: 210 }}
            padding="lg"
        >
            <AppShell.Header>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
            </AppShell.Header>
            <AppShell.Navbar bg={theme.colors.gray[0]}>
                <Navbar chat={chat} />
            </AppShell.Navbar>
            <AppShell.Main>
                <ChatHistory messageData={chat.messages.data} />
            </AppShell.Main>
            <AppShell.Footer bg={theme.colors.gray[0]} p="md">
                <RoleTabs chat={chat} />
            </AppShell.Footer>
        </AppShell>
    );
}
