export enum Role {
    assistant = "assistant",
    user = "user",
    system = "system",
}

export interface Message {
    content: string;
    createdAt: Date;
    role: Role;
}

export class ClaimContext {
    claimId: string;
    nextAppointment: string;
    nextPaymentAmount: string;
    nextPaymentDate: string;

    constructor(
        claimId: string = "",
        nextAppointment: string = "",
        nextPaymentAmount: string = "",
        nextPaymentDate: string = ""
    ) {
        this.claimId = claimId;
        this.nextAppointment = nextAppointment;
        this.nextPaymentAmount = nextPaymentAmount;
        this.nextPaymentDate = nextPaymentDate;
    }

    // Formats and stringifies field keys for use in LLM prompts
    // Examples:    claimId -> "Claim Id"
    //              nextAppointment -> "Next Appointment"
    private get formattedKeys(): Record<string, string> {
        return Object.keys(this).reduce(
            (acc, key) => ({
                ...acc,
                [key]: key
                    .replace(/([A-Z])/g, " $1") // add a space before capital letters (someName to some Name)
                    .replace(/^./, (str) => str.toUpperCase()), // capitalize the first letter
            }),
            {} as Record<string, string>
        );
    }

    // True if `this` instance has at least one field with a truthy value
    private get isNotEmpty(): boolean {
        const fieldValues: string[] = Object.values(this);
        return fieldValues.some((value) => value.trim()); // true if any trimmed value is not empty
    }

    // Builds system prompt for LLM
    get systemMessage(): string {
        // Static prompts
        let promptsArray = [
            "You are a helpful insurance claims adjuster.",
            "You are aiding an injured worker and responding to any questions they have about their insurance case.",
            "Please respond in a way that is easy to read in a chat interface.",
            "Avoid using markdown such as bold, numbered lists, or headings.",
            "Keep your responses conversational and plain-text only, with short and simple sentences.",
            "Keep the conversation focused on their insurance claim and any related issues; redirect back to their insurance claim if the conversation strays.",
        ];

        // Dynamically populates additional prompts given current ClaimContext fields
        // Example: `additionalContext` will look like: "The worker's: Claim Id is 9D2jdR; Next Appointment is 10/24/2024."
        if (this.isNotEmpty) {
            let additionalContextArray: string[] = [];
            Object.entries(this).forEach(([key, value]) => {
                if (value) {
                    const stringifiedKey = this.formattedKeys[key];
                    const stringifiedField = `${stringifiedKey} is ${value}`; // example string: "Claim Id is 9D2jdR"
                    additionalContextArray.push(stringifiedField);
                }
            });
            const additionalContext = `The worker's: ${additionalContextArray.join(
                "; "
            )}.`;
            promptsArray.push(additionalContext);
        }

        // Join all sentence prompts into a single string
        const prompts = promptsArray.join(" ");

        return prompts;
    }
}

export enum LLMProviderName {
    openai = "OpenAI",
    anthropic = "Anthropic",
}

export abstract class LLMProvider {
    name: LLMProviderName;
    apiKey: string;
    context: ClaimContext;
    model: string;

    availableModels: string[] = [];

    protected instance: any;

    constructor(
        name: LLMProviderName,
        apiKey: string,
        context: ClaimContext,
        model: string = ""
    ) {
        this.name = name;
        this.apiKey = apiKey;
        this.context = context;
        this.model = model;
    }

    abstract checkApiKey(): Promise<boolean>;

    abstract getSuggestion(
        messages: Message[],
        setSuggestion: React.Dispatch<React.SetStateAction<string>>
    ): Promise<void>;
}

import Anthropic from "@anthropic-ai/sdk";
export class AnthropicClient extends LLMProvider {
    availableModels: string[] = [
        "claude-3-opus-20240229",
        "claude-3-5-sonnet-20240620",
    ];

    constructor(apiKey: string, context: ClaimContext, model: string) {
        super(LLMProviderName.openai, apiKey, context);
        this.instance = new Anthropic({
            apiKey: this.apiKey,
            dangerouslyAllowBrowser: true,
        });
        this.model = model;
    }

    async checkApiKey(): Promise<boolean> {
        // TODO: Implement
        throw new Error("Anthropic client not implemented");
        return false;
    }

    async getSuggestion(
        messages: Message[],
        setSuggestion: React.Dispatch<React.SetStateAction<string>>
    ): Promise<void> {
        // TODO: Implement
        throw new Error("Anthropic client not implemented");
    }
}

import OpenAI from "openai";

interface OpenAIMessage {
    role: Role;
    content: string;
}

export class OpenAIClient extends LLMProvider {
    availableModels: string[] = ["gpt-4o-mini", "gpt-4o"];

    constructor(apiKey: string, context: ClaimContext, model: string) {
        super(LLMProviderName.openai, apiKey, context);
        this.instance = new OpenAI({
            apiKey: this.apiKey,
            dangerouslyAllowBrowser: true,
        });
        this.model = model;
    }

    protected formatMessages(messages: Message[]): OpenAIMessage[] {
        const systemMessage = {
            role: Role.system,
            content: this.context.systemMessage,
        };

        return [
            systemMessage,
            ...messages.map(({ role, content }) => ({ role, content })),
        ];
    }

    async checkApiKey(): Promise<boolean> {
        const response = await this.instance.models.list();
        return response.data.length > 0;
    }

    async getSuggestion(
        messages: Message[],
        setSuggestion: React.Dispatch<React.SetStateAction<string>>
    ): Promise<void> {
        const formattedMessages = this.formatMessages(messages);

        // Adapted from: https://platform.openai.com/docs/api-reference/streaming
        const stream = await this.instance.chat.completions.create({
            model: this.model,
            messages: formattedMessages,
            stream: true,
        });

        for await (const chunk of stream) {
            setSuggestion(
                (prevSuggestion) =>
                    prevSuggestion + (chunk.choices[0]?.delta?.content || "")
            );
        }
    }
}

export function createLLMProvider(
    providerName: LLMProviderName,
    apiKey: string,
    context: ClaimContext,
    model: string
): LLMProvider {
    switch (providerName) {
        case LLMProviderName.openai:
            return new OpenAIClient(apiKey, context, model);
        case LLMProviderName.anthropic:
            return new AnthropicClient(apiKey, context, model);
        default:
            throw new Error(`Unsupported LLM provider: ${providerName}`);
    }
}
