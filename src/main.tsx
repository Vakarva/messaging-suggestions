import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

import App from "./App.tsx";

const theme = createTheme({
    components: {
        ...Object.fromEntries(
            [
                "Button",
                "NumberInput",
                "PasswordInput",
                "Textarea",
                "TextInput",
                "Select",
            ].map((component) => [
                component,
                {
                    defaultProps: {
                        size: "md", // Mobile will auto focus when selected if size is smaller
                    },
                },
            ])
        ),
        Fieldset: {
            defaultProps: {
                radius: "lg",
            },
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider theme={theme}>
            <App />
        </MantineProvider>
    </StrictMode>
);
