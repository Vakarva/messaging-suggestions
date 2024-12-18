import { Stack, Tabs, ThemeIcon, useMantineTheme } from "@mantine/core";
import { IconHeartbeat, IconUserFilled } from "@tabler/icons-react";

import { Role } from "@custom-types";

import { ChatForm } from "@components/Chat/index";
import { ChatHook } from "@hooks/index";

interface RoleTabsProps {
    chat: ChatHook;
}

export default function RoleTabs({ chat }: RoleTabsProps) {
    const theme = useMantineTheme();

    const activeTabGradient = {
        gradient: {
            from: theme.colors.blue[3],
            to: theme.colors.blue[5],
            deg: 135,
        },
    };
    const inactiveTabGradient = {
        gradient: {
            from: theme.colors.gray[3],
            to: theme.colors.blue[2],
            deg: 135,
        },
    };

    const handleTabChange = (value: string | null) => {
        const roleValue = value as Role;
        if (roleValue !== chat.ui.input.role) {
            chat.ui.input.toggleRole();
        }
    };

    return (
        <Stack gap="xs">
            <Tabs value={chat.ui.input.role} onChange={handleTabChange}>
                <Tabs.List grow>
                    <Tabs.Tab
                        leftSection={
                            <ThemeIcon
                                {...(chat.ui.input.role === Role.user
                                    ? activeTabGradient
                                    : inactiveTabGradient)}
                                variant="gradient"
                            >
                                <IconUserFilled />
                            </ThemeIcon>
                        }
                        value={Role.user}
                    >
                        Worker
                    </Tabs.Tab>
                    <Tabs.Tab
                        leftSection={
                            <ThemeIcon
                                {...(chat.ui.input.role === Role.assistant
                                    ? activeTabGradient
                                    : inactiveTabGradient)}
                                variant="gradient"
                            >
                                <IconHeartbeat />
                            </ThemeIcon>
                        }
                        value={Role.assistant}
                    >
                        Adjuster
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
            <ChatForm chat={chat} />
        </Stack>
    );
}
