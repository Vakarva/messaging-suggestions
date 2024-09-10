export enum Role {
    assistant = "assistant",
    user = "user",
    system = "system"
}

export interface Message {
    content: string;
    createdAt: string;
    role: Role;
}

export class ClaimContext {
    claimId: string;
    nextAppointment: string;
    nextPaymentAmount: string;
    nextPaymentDate: string;

    constructor(claimId: string = "", nextAppointment: string = "", nextPaymentAmount: string = "", nextPaymentDate: string = "") {
        this.claimId = claimId;
        this.nextAppointment = nextAppointment;
        this.nextPaymentAmount = nextPaymentAmount;
        this.nextPaymentDate = nextPaymentDate;
    }

    // Formats and stringifies field keys for use in LLM prompts
    // Examples:    claimId -> "Claim Id"
    //              nextAppointment -> "Next Appointment"
    private get formattedKeys(): Record<string, string> {
        return Object.keys(this).reduce((acc, key) => ({
            ...acc,
            [key]: key
                .replace(/([A-Z])/g, ' $1')  // add a space before capital letters (someName to some Name)
                .replace(/^./, str => str.toUpperCase()) // capitalize the first letter
        }), {} as Record<string, string>);
    }

    // True if `this` instance has at least one field with a truthy value
    private get isNotEmpty(): boolean {
        const fieldValues: string[] = Object.values(this);
        return fieldValues.some(value => value.trim());   // true if any trimmed value is not empty
    }

    // Builds system prompt for LLM
    get systemMessage(): string {
        // Static prompts
        let promptsArray = [
            "You are a helpful insurance claims adjuster.",
            "You are aiding an injured worker and responding to any questions they have about their insurance case.",
            "Please respond in a way that is easy to read in a chat interface.",
            "Avoid using markdown such as bold, numbered lists, or headings.",
            "Keep your responses conversational and plain-text only, with short and simple sentences."
        ];

        // Dynamically populates additional prompts given current ClaimContext fields
        // Example: `additionalContext` will look like: "The worker's: Claim Id is 9D2jdR; Next Appointment is 10/24/2024."
        if (this.isNotEmpty) {
            let additionalContextArray: string[] = [];
            Object.entries(this).forEach(([key, value]) => {
                if (value) {
                    const stringifiedKey = this.formattedKeys[key];
                    const stringifiedField = `${stringifiedKey} is ${value}`;    // example string: "Claim Id is 9D2jdR"
                    additionalContextArray.push(stringifiedField);
                }
            });
            const additionalContext = `The worker's: ${additionalContextArray.join("; ")}.`;
            promptsArray.push(additionalContext);
        }

        // Join all sentence prompts into a single string
        const prompts = promptsArray.join(" ");

        return prompts;
    }
}