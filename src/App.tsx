import { Modal } from "@mantine/core";

import ApiKeyLogin from "@components/Login/ApiKeyLogin";
import Chat from "@components/Chat/Chat";
import useApiKeyLogin, { ApiKeyLoginStatus } from "@hooks/useApiKeyLogin";

export default function App() {
    const apiKeyLogin = useApiKeyLogin();

    return (
        <>
            <Modal
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                onClose={() => {}}
                opened={apiKeyLogin.status !== ApiKeyLoginStatus.SUCCESS}
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
                <ApiKeyLogin {...apiKeyLogin} />
            </Modal>

            <Chat
                llmApiClient={apiKeyLogin.llmApiClient}
                logout={apiKeyLogin.logout}
            />
        </>
    );
}
