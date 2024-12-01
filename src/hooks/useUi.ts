import { InputHook, OutputHook, useInput, useOutput } from "@hooks/index";

export interface UiHook {
    input: InputHook;
    output: OutputHook;
}

export default function useUi(): UiHook {
    const input = useInput();
    const output = useOutput();

    return {
        input,
        output,
    };
}
