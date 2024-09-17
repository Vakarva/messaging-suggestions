import { Group, Title, useMantineTheme } from "@mantine/core";
import { IconMessageChatbotFilled } from "@tabler/icons-react";

interface LogoProps {
    isMobile: boolean;
}

export default function Logo({ isMobile }: LogoProps) {
    const theme = useMantineTheme();

    return (
        <Group gap="sm">
            <IconMessageChatbotFilled color={theme.colors.blue[8]} size={30} />
            {isMobile && <Title order={3}>Messages</Title>}
        </Group>
    );
}
