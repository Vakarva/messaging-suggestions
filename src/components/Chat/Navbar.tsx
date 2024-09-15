import { Center, Drawer, Tooltip, Button, Stack, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconLogout2,
    IconMessageChatbotFilled,
    IconSettings,
} from "@tabler/icons-react";

import Settings from "@components/Chat/Settings";
import { ModelHook } from "@hooks/useModel";

import classes from "@styles/Navbar.module.css";

interface NavbarLinkProps {
    icon: typeof IconSettings;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, onClick }: NavbarLinkProps) {
    return (
        <Tooltip
            label={label}
            position="right"
            transitionProps={{ duration: 0 }}
        >
            <Button
                onClick={onClick}
                className={classes.link}
                variant="transparent"
            >
                <Icon
                    style={{ width: rem(20), height: rem(20) }}
                    stroke={1.5}
                />
            </Button>
        </Tooltip>
    );
}

interface NavbarProps {
    logout: () => void;
    model: ModelHook;
}

export default function Navbar({ logout, model }: NavbarProps) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <nav className={classes.navbar}>
            <Drawer onClose={close} opened={opened} title="Settings">
                <Settings close={close} model={model} />
            </Drawer>
            <Center>
                <IconMessageChatbotFilled size={30} />
            </Center>

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    <NavbarLink
                        icon={IconSettings}
                        label="Settings"
                        onClick={open}
                    />
                </Stack>
            </div>

            <NavbarLink icon={IconLogout2} label="Logout" onClick={logout} />
        </nav>
    );
}
