import { useState } from "react";
import {
    Center,
    Drawer,
    Tooltip,
    Button,
    Space,
    Stack,
    rem,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconHome2,
    IconGauge,
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
                className={classes.link}
                onClick={onClick}
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

const items = [
    { icon: IconHome2, label: "Home" },
    { icon: IconGauge, label: "Dashboard" },
];

interface NavbarProps {
    logout: () => void;
    model: ModelHook;
}

export default function Navbar({ logout, model }: NavbarProps) {
    const [active, setActive] = useState(2);
    const [opened, { open, close }] = useDisclosure(false);

    const theme = useMantineTheme();

    const links = items.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <nav className={classes.navbar}>
            <Drawer onClose={close} opened={opened} title="Settings">
                <Settings close={close} model={model} />
            </Drawer>
            <Center>
                <IconMessageChatbotFilled
                    color={theme.colors.blue[8]}
                    size={30}
                />
            </Center>

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                    <NavbarLink
                        icon={IconSettings}
                        label="Settings"
                        onClick={open}
                    />
                    <Space h={40} />
                    <NavbarLink
                        icon={IconLogout2}
                        label="Logout"
                        onClick={logout}
                    />
                </Stack>
            </div>
        </nav>
    );
}
