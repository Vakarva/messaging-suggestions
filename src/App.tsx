import { AppShell, Burger, Modal, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import ApiKeyLogin from "@components/Login/ApiKeyLogin";
import ChatHistory from "@components/Chat/ChatHistory";
import Navbar from "@components/Chat/Navbar";
import RoleTabs from "@components/Chat/RoleTabs";
import { ApiSessionStatus } from "@hooks/useApiSession";
import { useChat } from "@hooks/useChat";

export default function App() {
    const chat = useChat();
    const [opened, { toggle }] = useDisclosure(false);

    const theme = useMantineTheme();

    return (
        <>
            <Modal
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                onClose={() => {}}
                opened={chat.llm.apiSession.status !== ApiSessionStatus.SUCCESS}
                overlayProps={{
                    blur: 3,
                }}
                size="xs"
                styles={{
                    title: {
                        fontWeight: "bold",
                        margin: "0",
                        padding: "0",
                    },
                }}
                title="Enter API Key"
                withCloseButton={false}
            >
                <ApiKeyLogin {...chat.llm.apiSession} />
            </Modal>

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
                    <ChatHistory messageData={chat.form.messages.data} />
                </AppShell.Main>
                <AppShell.Footer bg={theme.colors.gray[0]} p="md">
                    <RoleTabs chat={chat} />
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
