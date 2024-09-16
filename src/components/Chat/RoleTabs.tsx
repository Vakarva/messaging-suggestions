import { Stack, Tabs, ThemeIcon, useMantineTheme } from "@mantine/core";
import { IconHeartbeat, IconUserFilled } from "@tabler/icons-react";

import { Role } from "@custom-types";

import ChatForm from "@components/Chat/ChatForm";
import { ChatHook } from "@hooks/useChat";

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
            to: theme.colors.gray[5],
            deg: 135,
        },
    };

    return (
        <Stack gap="xs">
            <Tabs
                value={chat.form.role}
                onChange={(value: string | null) => {
                    chat.form.setRole(value as Role);
                }}
            >
                <Tabs.List grow>
                    <Tabs.Tab
                        leftSection={
                            <ThemeIcon
                                {...(chat.form.role === Role.user
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
                                {...(chat.form.role === Role.assistant
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
