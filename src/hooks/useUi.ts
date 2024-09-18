import { InputHook, useInput } from "@hooks/useInput";
import { OutputHook, useOutput } from "@hooks/useOutput";

export interface UiHook {
    input: InputHook;
    output: OutputHook;
    sendMessage: () => void;
}

export function useUi(): UiHook {
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
