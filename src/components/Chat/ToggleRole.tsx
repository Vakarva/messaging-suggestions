import { useState } from "react";
import { Stack, Tabs, ThemeIcon } from "@mantine/core";
import { IconHeartbeat, IconUserFilled } from "@tabler/icons-react";

import { Message, Role, LLMProvider } from "@custom-types";

import ChatInput from "@components/Chat/ChatInput";

interface ToggleRoleProps {
    addMessage: (content: string, role: Role) => void;
    messages: Message[];
    provider: LLMProvider;
}

export default function ToggleRole({
    addMessage,
    messages,
    provider,
}: ToggleRoleProps) {
    const [activeTab, setActiveTab] = useState<string | null>(Role.user);

    return (
        <Stack gap="xs">
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow>
                    <Tabs.Tab
                        leftSection={
                            <ThemeIcon
                                color="teal"
                                gradient={{
                                    from: "gray",
                                    to: "blue",
                                    deg: 135,
                                }}
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
                                color="red"
                                gradient={{
                                    from: "red",
                                    to: "yellow",
                                    deg: 135,
                                }}
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
            <ChatInput
                addMessage={addMessage}
                messages={messages}
                provider={provider}
                role={activeTab === Role.user ? Role.user : Role.assistant}
            />
        </Stack>
    );
}
