import { useState } from "react";

export interface ClaimContext {
    claimId: string;
    nextAppointment: string;
    nextPaymentAmount: string;
    nextPaymentDate: string;
}

export interface ClaimContextHook {
    buildPrompt: () => string;
    claimId: string;
    nextAppointment: string;
    nextPaymentAmount: string;
    nextPaymentDate: string;
    set: (context: ClaimContext) => void;
    update: (name: string, value: string) => void;
}

export const useClaimContext = (
    context: Partial<ClaimContext> = {}
): ClaimContextHook => {
    const [claimId, _setClaimId] = useState<string>(context.claimId || "");
    const [nextAppointment, _setNextAppointment] = useState<string>(
        context.nextAppointment || ""
    );
    const [nextPaymentAmount, _setNextPaymentAmount] = useState<string>(
        context.nextPaymentAmount || ""
    );
    const [nextPaymentDate, _setNextPaymentDate] = useState<string>(
        context.nextPaymentDate || ""
    );

    enum _ClaimContextLabels {
        claimId = "Claim ID",
        nextAppointment = "Next appointment",
        nextPaymentAmount = "Next payment amount",
        nextPaymentDate = "Next payment date",
    }

    const buildPrompt = (): string => {
        let promptsArray = [
            "You are a helpful insurance claims adjuster.",
            "You are aiding an injured worker and responding to any questions they have about their insurance case.",
            "Please respond in a way that is easy to read in a chat interface.",
            "Avoid using markdown such as bold, numbered lists, or headings.",
            "Keep your responses conversational and plain-text only, with short and simple sentences.",
            "Keep the conversation focused on their insurance claim and any related issues; redirect back to their insurance claim if the conversation strays.",
            `The current local date and time is ${new Date().toLocaleString()}.`,
        ];

        const contextArray = Object.entries({
            claimId,
            nextAppointment,
            nextPaymentAmount,
            nextPaymentDate,
        })
            .filter(([, value]) => value)
            .map(([key, value]) => {
                const label =
                    _ClaimContextLabels[
                        key as keyof typeof _ClaimContextLabels
                    ];
                return `${label} is ${value}`;
            });
        if (contextArray.length > 0) {
            const context = `The worker's: ${contextArray.join("; ")}.`;
            promptsArray.push(context);
        }

        const prompts = promptsArray.join(" ");

        return prompts;
    };

    const update = (name: string, value: string) => {
        switch (name) {
            case "claimId":
                _setClaimId(value);
                break;
            case "nextAppointment":
                _setNextAppointment(value);
                break;
            case "nextPaymentAmount":
                _setNextPaymentAmount(value);
                break;
            case "nextPaymentDate":
                _setNextPaymentDate(value);
                break;
        }
    };

    const set = ({
        claimId,
        nextAppointment,
        nextPaymentAmount,
        nextPaymentDate,
    }: ClaimContext) => {
        _setClaimId(claimId);
        _setNextAppointment(nextAppointment);
        _setNextPaymentAmount(nextPaymentAmount);
        _setNextPaymentDate(nextPaymentDate);
    };

    return {
        buildPrompt,
        claimId,
        nextAppointment,
        nextPaymentAmount,
        nextPaymentDate,
        set,
        update,
    };
};
