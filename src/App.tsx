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

import { ChatHistory, Navbar, RoleTabs } from "@components/Chat/index";
import { ApiKeyLogin } from "@components/Login/index";
import { useChat } from "@hooks/index";

export default function App() {
    const chat = useChat();
    const [isNavbarOpened, { toggle: toggleNavbar }] = useDisclosure(false);

    const theme = useMantineTheme();
    const componentBgColor = theme.colors.gray[0];
    const componentPadding = theme.spacing.md;

    return (
        <>
            <Modal
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                onClose={() => {}}
                opened={!chat.llm.apiSession.isSuccess}
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
                <AppShell.Header bg={componentBgColor} p={componentPadding}>
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
                <AppShell.Navbar
                    bg={componentBgColor}
                    maw={200}
                    p={componentPadding}
                >
                    <Navbar llm={chat.llm} toggleNavbar={toggleNavbar} />
                </AppShell.Navbar>
                <AppShell.Main>
                    <ChatHistory messages={chat.ui.output.messages} />
                </AppShell.Main>
                <AppShell.Footer
                    bg={componentBgColor}
                    pb={componentPadding}
                    pl={componentPadding}
                    pr={componentPadding}
                >
                    <RoleTabs chat={chat} />
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
