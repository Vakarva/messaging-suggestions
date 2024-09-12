import { useState } from "react";
import { Stack, Tabs } from "@mantine/core";
import { IconTool, IconUserFilled } from "@tabler/icons-react";

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
                        leftSection={<IconUserFilled />}
                        value={Role.user}
                    >
                        Worker
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconTool />} value={Role.assistant}>
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
