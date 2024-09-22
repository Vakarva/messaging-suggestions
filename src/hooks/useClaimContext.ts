import { useCallback, useMemo, useState } from "react";

export interface ClaimContext {
    claimId: string;
    nextAppointment: string;
    nextPaymentAmount: string;
    nextPaymentDate: string;
}

const emptyClaimContext: ClaimContext = {
    claimId: "",
    nextAppointment: "",
    nextPaymentAmount: "",
    nextPaymentDate: "",
};

export interface ClaimContextHook {
    buildPrompt: () => string;
    data: ClaimContext;
    set: (context: ClaimContext) => void;
    update: (name: string, value: string) => void;
}

export default function useClaimContext(): ClaimContextHook {
    const [data, setData] = useState<ClaimContext>(emptyClaimContext);

    const _staticPrompts = useMemo(
        () =>
            [
                "You are a helpful insurance claims adjuster.",
                "You are aiding an injured worker and responding to any questions they have about their insurance case.",
                "Please respond in a way that is easy to read in a chat interface.",
                "Avoid using markdown such as bold, numbered lists, or headings.",
                "Keep your responses conversational and plain-text only, with short and simple sentences.",
                "Keep the conversation focused on their insurance claim and any related issues; redirect back to their insurance claim if the conversation strays.",
            ].join(" "),
        []
    );

    const _buildContextPromptsArray = useCallback(
        (context: ClaimContext): string[] => {
            return Object.entries(context)
                .filter(([_, value]) => value.trim() !== "")
                .map(([key, value]) => {
                    const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());
                    return `${label} is ${value}`;
                });
        },
        []
    );

    const buildPrompt = (): string => {
        let dynamicPromptsArray = [
            `The current local date and time is ${new Date().toLocaleString()}.`,
        ];

        const contextPromptsArray = _buildContextPromptsArray(data);
        if (contextPromptsArray.length > 0) {
            const contextPrompts = `The worker's: ${contextPromptsArray.join(
                "; "
            )}.`;
            dynamicPromptsArray.push(contextPrompts);
        }

        const prompts = [_staticPrompts, ...dynamicPromptsArray].join(" ");
        return prompts;
    };

    const update = (name: string, value: string) => {
        setData((oldData) => ({ ...oldData, [name]: value }));
    };

    const set = (data: ClaimContext) => {
        setData((oldData) => ({ ...oldData, ...data }));
    };

    return {
        buildPrompt,
        data,
        set,
        update,
    };
}
