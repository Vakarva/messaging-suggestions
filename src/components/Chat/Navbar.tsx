import { Button, Drawer, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout2, IconSettings } from "@tabler/icons-react";

import Settings from "@components/Chat/Settings";
import { LlmHook } from "@hooks/useLlm";

import classes from "@styles/Navbar.module.css";

interface NavbarButtonProps {
    icon: typeof IconSettings;
    label: string;
    onClick?(): void;
}

function NavbarButton({ icon: Icon, label, onClick }: NavbarButtonProps) {
    return (
        <Button
            className={classes.navbarLink}
            display="flex"
            h={50}
            onClick={onClick}
            p="sm"
            radius="md"
            variant="subtle"
            w="100%"
        >
            <Icon stroke={1.5} />
            <Text ml="sm">{label}</Text>
        </Button>
    );
}

interface NavbarProps {
    llm: LlmHook;
    toggleNavbar: () => void;
}

export default function Navbar({ llm, toggleNavbar }: NavbarProps) {
    const [isSettingsOpened, { open: openSettings, close: closeSettings }] =
        useDisclosure(false);

    const items = [
        { icon: IconSettings, label: "Settings", onClick: openSettings },
        { icon: IconLogout2, label: "Logout", onClick: llm.apiSession.logout },
    ];

    const navbarButtons = items.map((link) => (
        <NavbarButton {...link} key={link.label} />
    ));

    const closeSettingsAndNavbar = () => {
        closeSettings();
        toggleNavbar();
    };

    return (
        <Stack>
            <Drawer
                onClose={closeSettingsAndNavbar}
                opened={isSettingsOpened}
                title={
                    <Group gap="xs">
                        <IconSettings />
                        <Title order={4}>Settings</Title>
                    </Group>
                }
            >
                <Settings close={closeSettingsAndNavbar} llm={llm} />
            </Drawer>

            <Stack gap="sm">{navbarButtons}</Stack>
        </Stack>
    );
}
