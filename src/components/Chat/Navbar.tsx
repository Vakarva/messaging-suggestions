import {
    Button,
    Drawer,
    // Divider,
    // rem,
    Space,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconHome2,
    IconGauge,
    IconLogout2,
    IconSettings,
} from "@tabler/icons-react";

import Logo from "@components/Chat/Logo";
import Settings from "@components/Chat/Settings";
import { LlmHook } from "@hooks/useLlm";

import classes from "@styles/Navbar.module.css";

interface NavbarLinkProps {
    icon: typeof IconSettings;
    isMobile: boolean;
    label: string;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, isMobile, label, onClick }: NavbarLinkProps) {
    return (
        <Tooltip
            disabled={isMobile}
            label={label}
            position="right"
            transitionProps={{ duration: 0 }}
        >
            <Button
                className={classes.navbarLink}
                display="flex"
                h={50}
                onClick={onClick}
                p="sm"
                radius="md"
                variant="subtle"
                w={isMobile ? "100%" : undefined}
            >
                <Icon
                    // style={{ width: rem(20), height: rem(20) }}
                    // style={{ width: "100%" }}
                    stroke={1.5}
                    size="100%"
                />
                {isMobile && <Text ml="sm">{label}</Text>}
            </Button>
        </Tooltip>
    );
}

interface NavbarProps {
    llm: LlmHook;
    isMobile: boolean;
}

export default function Navbar({ llm, isMobile }: NavbarProps) {
    const [isSettingsOpened, { open: openSettings, close: closeSettings }] =
        useDisclosure(false);

    const items = [
        { icon: IconHome2, label: "Home" },
        { icon: IconGauge, label: "Dashboard" },
        { icon: IconSettings, label: "Settings", onClick: openSettings },
    ];

    const links = items.map((link) => (
        <NavbarLink {...link} isMobile={isMobile} key={link.label} />
    ));

    return (
        <Stack>
            <Drawer
                onClose={closeSettings}
                opened={isSettingsOpened}
                title="Settings"
            >
                <Settings close={closeSettings} llm={llm} />
            </Drawer>

            <Stack mt={20}>
                <Logo isMobile={isMobile} />
            </Stack>
            <Stack align="flex-start" gap={0} mt={0}>
                {links}
                <Space h={40} />
                <NavbarLink
                    icon={IconLogout2}
                    isMobile={isMobile}
                    label="Logout"
                    onClick={llm.apiSession.logout}
                />
            </Stack>
        </Stack>
    );
}
