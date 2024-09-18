import { AppShell, Burger, Group, Modal, useMantineTheme } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import ApiKeyLogin from "@components/Login/ApiKeyLogin";
import ChatHistory from "@components/Chat/ChatHistory";
import Logo from "@components/Chat/Logo";
import Navbar from "@components/Chat/Navbar";
import RoleTabs from "@components/Chat/RoleTabs";
import { ApiSessionStatus } from "@hooks/useApiSession";
import { useChat } from "@hooks/useChat";

export default function App() {
    const chat = useChat();
    const [isNavbarOpened, { toggle: toggleNavbar }] = useDisclosure(false);
    const isMobile = useMediaQuery("(max-width: 768px)") as boolean;

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
                header={{ height: 60, collapsed: !isMobile }}
                footer={{ height: 210 }}
                navbar={{
                    width: 80,
                    breakpoint: "sm",
                    collapsed: { mobile: !isNavbarOpened },
                }}
                padding="lg"
            >
                <AppShell.Header p="md">
                    <Group>
                        <Burger
                            opened={isNavbarOpened}
                            onClick={toggleNavbar}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Logo isMobile={isMobile} />
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar bg={theme.colors.gray[0]} maw={225} p="md">
                    <Burger
                        opened={isNavbarOpened}
                        onClick={toggleNavbar}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Navbar chat={chat} isMobile={isMobile} />
                </AppShell.Navbar>
                <AppShell.Main>
                    <ChatHistory messages={chat.ui.output.messages} />
                </AppShell.Main>
                <AppShell.Footer bg={theme.colors.gray[0]} p="md">
                    <RoleTabs chat={chat} />
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
