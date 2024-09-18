import {
    AppShell,
    Burger,
    Group,
    Modal,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMessageChatbotFilled } from "@tabler/icons-react";

import ApiKeyLogin from "@components/Login/ApiKeyLogin";
import ChatHistory from "@components/Chat/ChatHistory";
import Navbar from "@components/Chat/Navbar";
import RoleTabs from "@components/Chat/RoleTabs";
import { ApiSessionStatus } from "@hooks/useApiSession";
import { useChat } from "@hooks/useChat";

export default function App() {
    const chat = useChat();
    const [isNavbarOpened, { toggle: toggleNavbar }] = useDisclosure(false);

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
                header={{ height: 55 }}
                footer={{ height: 170 }}
                navbar={{
                    width: 170,
                    breakpoint: "sm",
                    collapsed: {
                        desktop: !isNavbarOpened,
                        mobile: !isNavbarOpened,
                    },
                }}
                padding="lg"
            >
                <AppShell.Header bg={theme.colors.gray[0]} p="md">
                    <Group>
                        <Burger
                            opened={isNavbarOpened}
                            onClick={toggleNavbar}
                            size="sm"
                        />
                        <Group gap="sm">
                            <IconMessageChatbotFilled
                                color={theme.colors.blue[8]}
                                size={30}
                            />
                            <Title order={3}>Messages</Title>
                        </Group>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar bg={theme.colors.gray[0]} maw={200} p="md">
                    <Navbar llm={chat.llm} toggleNavbar={toggleNavbar} />
                </AppShell.Navbar>
                <AppShell.Main>
                    <ChatHistory messages={chat.ui.output.messages} />
                </AppShell.Main>
                <AppShell.Footer
                    bg={theme.colors.gray[0]}
                    pb="md"
                    pl="md"
                    pr="md"
                >
                    <RoleTabs chat={chat} />
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
