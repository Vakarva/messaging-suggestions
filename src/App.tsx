import { Modal } from "@mantine/core";

import ApiKeyLogin from "@components/Login/ApiKeyLogin";
import Chat from "@components/Chat/Chat";
import useApiKeyLogin from "@hooks/useApiKeyLogin";

export default function App() {
    const apiKeyLogin = useApiKeyLogin();

    const isNotLoggedIn = apiKeyLogin.isValidApiKey !== true;

    return (
        <main>
            <Modal
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                onClose={() => {}}
                opened={isNotLoggedIn}
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
        </main>
    );
}
