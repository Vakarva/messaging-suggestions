import { useState } from "react";
import { NumberFormatValues, SourceInfo } from "react-number-format";

export interface ClaimContext {
    claimId: string;
    nextAppointment: string;
    nextPaymentAmount: string;
    nextPaymentDate: string;
}

export interface ClaimContextHook {
    buildSystemMessage: () => string;
    claimId: string;
    handleNumberInputChange: (
        values: NumberFormatValues,
        sourceInfo: SourceInfo
    ) => void;
    handleTextInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    nextAppointment: string;
    nextPaymentAmount: string;
    nextPaymentDate: string;
    setClaimContext: (claimContext: ClaimContext) => void;
}

export const useClaimContext = (
    claimContext: Partial<ClaimContext> = {}
): ClaimContextHook => {
    const [claimId, setClaimId] = useState<string>(claimContext.claimId || "");
    const [nextAppointment, setNextAppointment] = useState<string>(
        claimContext.nextAppointment || ""
    );
    const [nextPaymentAmount, setNextPaymentAmount] = useState<string>(
        claimContext.nextPaymentAmount || ""
    );
    const [nextPaymentDate, setNextPaymentDate] = useState<string>(
        claimContext.nextPaymentDate || ""
    );

    const handleNumberInputChange = (
        values: NumberFormatValues,
        sourceInfo: SourceInfo
    ) => {
        const target = sourceInfo.event?.target as HTMLInputElement; // TS can't infer target type

        switch (target.name) {
            case "nextPaymentAmount":
                setNextPaymentAmount(values.formattedValue);
                break;
            default:
                break;
        }
    };

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        switch (name) {
            case "claimId":
                setClaimId(value);
                break;
            case "nextAppointment":
                setNextAppointment(value);
                break;
            case "nextPaymentDate":
                setNextPaymentDate(value);
                break;
        }
    };

    const setClaimContext = ({
        claimId,
        nextAppointment,
        nextPaymentAmount,
        nextPaymentDate,
    }: ClaimContext) => {
        setClaimId(claimId);
        setNextAppointment(nextAppointment);
        setNextPaymentAmount(nextPaymentAmount);
        setNextPaymentDate(nextPaymentDate);
    };

    enum ClaimContextLabels {
        claimId = "Claim ID",
        nextAppointment = "Next appointment",
        nextPaymentAmount = "Next payment amount",
        nextPaymentDate = "Next payment date",
    }

    const buildSystemMessage = (): string => {
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
                    ClaimContextLabels[key as keyof typeof ClaimContextLabels];
                return `${label} is ${value}`;
            });
        if (contextArray.length > 0) {
            const context = `The worker's: ${contextArray.join("; ")}.`;
            promptsArray.push(context);
        }

        const prompts = promptsArray.join(" ");

        return prompts;
    };

    return {
        claimId,
        nextAppointment,
        nextPaymentAmount,
        nextPaymentDate,
        handleNumberInputChange,
        handleTextInputChange,
        setClaimContext,
        buildSystemMessage,
    };
};
