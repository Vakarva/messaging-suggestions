import { useState } from "react";
import { Stack, Tabs, ThemeIcon, useMantineTheme } from "@mantine/core";
import { IconHeartbeat, IconUserFilled } from "@tabler/icons-react";

import { Role } from "@custom-types";

import ChatForm from "@components/Chat/ChatForm";
import { ModelHook } from "@hooks/useModel";

interface RoleTabsProps {
    model: ModelHook;
}

export default function RoleTabs({ model }: RoleTabsProps) {
    const [activeTab, setActiveTab] = useState<string | null>(Role.user);

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
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow>
                    <Tabs.Tab
                        leftSection={
                            <ThemeIcon
                                {...(activeTab === Role.user
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
                                {...(activeTab === Role.assistant
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
            <ChatForm
                model={model}
                role={activeTab === Role.user ? Role.user : Role.assistant}
            />
        </Stack>
    );
}
