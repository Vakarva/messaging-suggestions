import { AppShell, Burger, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { LlmApiClient, LlmApiClientType } from "@custom-types";

import ChatHistory from "@components/Chat/ChatHistory";
import Navbar from "@components/Chat/Navbar";
import RoleTabs from "@components/Chat/RoleTabs";
import { useModel } from "@hooks/useModel";

interface ChatProps {
    llmApiClient: LlmApiClient<LlmApiClientType>;
    logout: () => void;
}

export default function Chat({ llmApiClient, logout }: ChatProps) {
    const model = useModel(llmApiClient);
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
                <Navbar logout={logout} model={model} />
            </AppShell.Navbar>
            <AppShell.Main>
                <ChatHistory messages={model.messages} />
            </AppShell.Main>
            <AppShell.Footer bg={theme.colors.gray[0]} p="md">
                <RoleTabs model={model} />
            </AppShell.Footer>
        </AppShell>
    );
}
