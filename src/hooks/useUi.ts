import { InputHook, OutputHook, useInput, useOutput } from "@hooks/index";

export interface UiHook {
    input: InputHook;
    output: OutputHook;
    sendMessage: () => void;
}

export default function useUi(): UiHook {
    const input = useInput();
    const output = useOutput();

    const sendMessage = () => {
        output.append(input.text.trim(), input.role);
        input.reset();
    };

    return {
        input,
        output,
        sendMessage,
    };
}
