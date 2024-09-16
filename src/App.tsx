import { Modal } from "@mantine/core";

import ApiKeyLogin from "@components/Login/ApiKeyLogin";
import Chat from "@components/Chat/Chat";
import { ApiSessionStatus } from "@hooks/useApiSession";
import { useChat } from "@hooks/useChat";

export default function App() {
    const chat = useChat();

    return (
        <>
            <Modal
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                onClose={() => {}}
                opened={chat.llm.apiSession.status !== ApiSessionStatus.SUCCESS}
                overlayProps={{
                    blur: 3,
                }}
                size="xs"
                styles={{
                    title: {
                        fontWeight: "bold",
                        margin: "0",
                        padding: "0",
                    },
                }}
                title="Enter API Key"
                withCloseButton={false}
            >
                <ApiKeyLogin {...chat.llm.apiSession} />
            </Modal>

            <Chat chat={chat} />
        </>
    );
}
