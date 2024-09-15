// import { useState } from "react";

export enum Role {
    assistant = "assistant",
    user = "user",
}

export interface Message {
    content: string;
    createdAt: Date;
    role: Role;
}

// export interface ClaimContext {
//     claimId: string;
//     nextAppointment: string;
//     nextPaymentAmount: string;
//     nextPaymentDate: string;
// }

// export interface ClaimContextHook {
//     buildSystemMessage: () => string;
//     claimId: string;
//     handleNumberInputChange: (
//         values: NumberFormatValues,
//         sourceInfo: SourceInfo
//     ) => void;
//     handleTextInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     nextAppointment: string;
//     nextPaymentAmount: string;
//     nextPaymentDate: string;
//     reset: () => void;
//     save: () => void;
//     setClaimId: React.Dispatch<React.SetStateAction<string>>;
//     setNextAppointment: React.Dispatch<React.SetStateAction<string>>;
//     setNextPaymentAmount: React.Dispatch<React.SetStateAction<string>>;
//     setNextPaymentDate: React.Dispatch<React.SetStateAction<string>>;
// }

// import { NumberFormatValues, SourceInfo } from "react-number-format";

// export const useClaimContext = (): ClaimContextHook => {
//     const [claimId, setClaimId] = useState<string>("");
//     const [nextAppointment, setNextAppointment] = useState<string>("");
//     const [nextPaymentAmount, setNextPaymentAmount] = useState<string>("");
//     const [nextPaymentDate, setNextPaymentDate] = useState<string>("");

//     const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;

//         switch (name) {
//             case "claimId":
//                 setClaimId(value);
//                 break;
//             case "nextAppointment":
//                 setNextAppointment(value);
//                 break;
//             case "nextPaymentDate":
//                 setNextPaymentDate(value);
//                 break;
//             default:
//                 break;
//         }
//     };

//     const handleNumberInputChange = (
//         values: NumberFormatValues,
//         sourceInfo: SourceInfo
//     ) => {
//         switch (sourceInfo.event?.target.name) {
//             case "nextPaymentAmount":
//                 setNextPaymentAmount(values.formattedValue);
//                 break;
//             default:
//                 break;
//         }
//     };

//     // function reset() {
//     //     setClaimId(savedContext.claimId ?? "");
//     //     setNextAppointment(savedContext.nextAppointment ?? "");
//     //     setNextPaymentAmount(savedContext.nextPaymentAmount ?? "");
//     //     setNextPaymentDate(savedContext.nextPaymentDate ?? "");
//     // }

//     const save = ({
//         claimId,
//         nextAppointment,
//         nextPaymentAmount,
//         nextPaymentDate,
//     }: ClaimContext) => {
//         setClaimId(claimId);
//         setNextAppointment(nextAppointment);
//         setNextPaymentAmount(nextPaymentAmount);
//         setNextPaymentDate(nextPaymentDate);
//     };

//     enum ClaimContextLabels {
//         claimId = "Claim ID",
//         nextAppointment = "Next appointment",
//         nextPaymentAmount = "Next payment amount",
//         nextPaymentDate = "Next payment date",
//     }

//     const buildSystemMessage = (): string => {
//         // Static prompts
//         let promptsArray = [
//             "You are a helpful insurance claims adjuster.",
//             "You are aiding an injured worker and responding to any questions they have about their insurance case.",
//             "Please respond in a way that is easy to read in a chat interface.",
//             "Avoid using markdown such as bold, numbered lists, or headings.",
//             "Keep your responses conversational and plain-text only, with short and simple sentences.",
//             "Keep the conversation focused on their insurance claim and any related issues; redirect back to their insurance claim if the conversation strays.",
//         ];

//         // Dynamically populate additional prompts given current ClaimContext fields
//         // Example: `additionalContext` will look like: "The worker's: Claim Id is 9D2jdR; Next Appointment is 10/24/2024."
//         let contextArray: string[] = [];
//         Object.entries({
//             claimId,
//             nextAppointment,
//             nextPaymentAmount,
//             nextPaymentDate,
//         }).forEach(([key, value]: [any, string]) => {
//             if (value) {
//                 const label =
//                     ClaimContextLabels[key as keyof typeof ClaimContextLabels];
//                 const stringifiedField = `${label} is ${value}`; // example string: "Claim Id is 9D2jdR"
//                 contextArray.push(stringifiedField);
//             }
//         });
//         // If contextArray is not empty, add to prompts
//         if (contextArray.length > 0) {
//             const context = `The worker's: ${contextArray.join("; ")}.`;
//             promptsArray.push(context);
//         }

//         // Join all sentence prompts into a single string
//         const prompts = promptsArray.join(" ");

//         return prompts;
//     };

//     return {
//         claimId,
//         buildSystemMessage,
//         handleNumberInputChange,
//         handleTextInputChange,
//         nextAppointment,
//         nextPaymentAmount,
//         nextPaymentDate,
//         reset,
//         save,
//         setNextPaymentAmount,
//     };
// };

// export class ClaimContext {
//     claimId: string;
//     nextAppointment: string;
//     nextPaymentAmount: string;
//     nextPaymentDate: string;

//     constructor(
//         claimId: string = "",
//         nextAppointment: string = "",
//         nextPaymentAmount: string = "",
//         nextPaymentDate: string = ""
//     ) {
//         this.claimId = claimId;
//         this.nextAppointment = nextAppointment;
//         this.nextPaymentAmount = nextPaymentAmount;
//         this.nextPaymentDate = nextPaymentDate;
//     }

//     // Formats and stringifies field keys for use in LLM prompts
//     // Examples:    claimId -> "Claim Id"
//     //              nextAppointment -> "Next Appointment"
//     private get formattedKeys(): Record<string, string> {
//         return Object.keys(this).reduce(
//             (acc, key) => ({
//                 ...acc,
//                 [key]: key
//                     .replace(/([A-Z])/g, " $1") // add a space before capital letters (someName to some Name)
//                     .replace(/^./, (str) => str.toUpperCase()), // capitalize the first letter
//             }),
//             {} as Record<string, string>
//         );
//     }

//     // True if `this` instance has at least one field with a truthy value
//     private get isNotEmpty(): boolean {
//         const fieldValues: string[] = Object.values(this);
//         return fieldValues.some((value) => value.trim()); // true if any trimmed value is not empty
//     }

//     // Builds system prompt for LLM
//     get systemMessage(): string {
//         // Static prompts
//         let promptsArray = [
//             "You are a helpful insurance claims adjuster.",
//             "You are aiding an injured worker and responding to any questions they have about their insurance case.",
//             "Please respond in a way that is easy to read in a chat interface.",
//             "Avoid using markdown such as bold, numbered lists, or headings.",
//             "Keep your responses conversational and plain-text only, with short and simple sentences.",
//             "Keep the conversation focused on their insurance claim and any related issues; redirect back to their insurance claim if the conversation strays.",
//         ];

//         // Dynamically populates additional prompts given current ClaimContext fields
//         // Example: `additionalContext` will look like: "The worker's: Claim Id is 9D2jdR; Next Appointment is 10/24/2024."
//         if (this.isNotEmpty) {
//             let additionalContextArray: string[] = [];
//             Object.entries(this).forEach(([key, value]) => {
//                 if (value) {
//                     const stringifiedKey = this.formattedKeys[key];
//                     const stringifiedField = `${stringifiedKey} is ${value}`; // example string: "Claim Id is 9D2jdR"
//                     additionalContextArray.push(stringifiedField);
//                 }
//             });
//             const additionalContext = `The worker's: ${additionalContextArray.join(
//                 "; "
//             )}.`;
//             promptsArray.push(additionalContext);
//         }

//         // Join all sentence prompts into a single string
//         const prompts = promptsArray.join(" ");

//         return prompts;
//     }
// }

// function buildPrompt(context: ClaimContext): string {
//     const formattedKeys = Object.keys(context).reduce(
//         (acc, key) => ({
//             ...acc,
//             [key]: key
//                 .replace(/([A-Z])/g, " $1") // add a space before capital letters (someName to some Name)
//                 .replace(/^./, (str) => str.toUpperCase()), // capitalize the first letter
//         }),
//         {} as Record<string, string>
//     );

//     // Dynamically populates additional prompts given current ClaimContext fields
//     // Example: `additionalContext` will look like: "The worker's: Claim Id is 9D2jdR; Next Appointment is 10/24/2024."
//     let contextArray: string[] = [];

//     Object.entries(context).forEach(([key, value]) => {
//         if (value) {
//             const stringifiedKey = this.formattedKeys[key];
//             const stringifiedField = `${stringifiedKey} is ${value}`; // example string: "Claim Id is 9D2jdR"
//             additionalContextArray.push(stringifiedField);
//         }
//     });
//     const additionalContext = `The worker's: ${additionalContextArray.join(
//         "; "
//     )}.`;
//     promptsArray.push(additionalContext);
//     }
//     return contextArray.length > 0 ? contextArray.join("; ") : "";
// }

// export abstract class LLMProvider {
//     instance: LlmApiClientType;
//     context: string;
//     model: string;
//     availableModels: string[] = [];

//     constructor(instance: LlmApiClientType, context: string, model: string = "") {
//         this.instance = instance;
//         this.context = context;
//         this.model = model;
//     }

//     abstract checkApiKey(): Promise<boolean>;

//     abstract getSuggestion(
//         messages: Message[],
//         initSuggestion: () => void,
//         appendToSuggestion: (text: string) => void
//     ): Promise<void>;
// }

// class AnthropicClient extends LLMProvider {
//     availableModels: string[] = [
//         "claude-3-opus-20240229",
//         "claude-3-5-sonnet-20240620",
//     ];

//     constructor(instance: Anthropic, context: string, model: string) {
//         super(instance, context, model);
//     }

//     async checkApiKey(): Promise<boolean> {
//         // TODO: Implement
//         throw new Error("Anthropic client not implemented");
//         return false;
//     }

//     async getSuggestion(
//         _messages: Message[],
//         _initSuggestion: () => void,
//         _appendToSuggestion: (text: string) => void
//     ): Promise<void> {
//         // TODO: Implement
//         throw new Error("Anthropic client not implemented");
//     }
// }

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { Stream } from "openai/streaming";

export enum LlmProviderName {
    openAi = "OpenAI",
    anthropic = "Anthropic",
}

export type LlmApiClientType = Anthropic | OpenAI;

export abstract class LlmApiClient<TClient extends LlmApiClientType> {
    protected instance: TClient;

    constructor(instance: TClient) {
        this.instance = instance;
    }

    abstract get defaultModelName(): string;
    abstract get availableModels(): string[];

    abstract checkApiKey(): Promise<boolean>;
    abstract getStream(
        prompt: string,
        messages: Message[],
        model: string
    ): Promise<any>;
    abstract writeStream(
        stream: any,
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ): Promise<void>;
}

class AnthropicApiClient extends LlmApiClient<Anthropic> {
    constructor(apiKey: string) {
        const anthropicInstance = new Anthropic({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
        super(anthropicInstance);
    }

    get availableModels(): string[] {
        return ["claude-3-opus-20240229", "claude-3-5-sonnet-20240620"];
    }

    get defaultModelName(): string {
        return this.availableModels[0];
    }

    async checkApiKey(): Promise<boolean> {
        try {
            await this.instance.messages.create({
                model: this.defaultModelName,
                max_tokens: 1,
                messages: [{ role: "user", content: "Test" }],
            });
            return true;
        } catch (error) {
            console.error("Error validating Anthropic API key:", error);
            return false;
        }
    }

    async getStream(
        _prompt: string,
        _messages: Message[],
        _model: string
    ): Promise<any> {
        // TODO: Implement
        throw new Error("Anthropic getStream not implemented");
    }

    async writeStream(
        _stream: any,
        _initializeOutput: () => void,
        _appendToOutput: (text: string) => void
    ): Promise<void> {
        // TODO: Implement
        throw new Error("Anthropic writeStream not implemented");
    }
}

interface OpenAiMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

class OpenAiApiClient extends LlmApiClient<OpenAI> {
    constructor(apiKey: string) {
        const openAiInstance = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
        super(openAiInstance);
    }

    get availableModels(): string[] {
        return ["gpt-4o-mini", "gpt-4o"];
    }

    get defaultModelName(): string {
        return this.availableModels[0];
    }

    async checkApiKey(): Promise<boolean> {
        try {
            await this.instance.models.list();
            return true;
        } catch (error) {
            console.error("Error validating OpenAI API key:", error);
            return false;
        }
    }

    protected formatMessages(
        prompt: string,
        messages: Message[]
    ): OpenAiMessage[] {
        const systemMessage = {
            role: "system",
            content: prompt,
        } as OpenAiMessage;

        return [
            systemMessage,
            ...messages.map(({ role, content }) => ({ role, content })),
        ];
    }

    async getStream(
        prompt: string,
        messages: Message[],
        model: string
    ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
        const formattedMessages = this.formatMessages(prompt, messages);

        const stream = await this.instance.chat.completions.create({
            model: model,
            messages: formattedMessages,
            stream: true,
        });
        return stream;
    }

    async writeStream(
        stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ) {
        initializeOutput();
        for await (const chunk of stream) {
            appendToOutput(chunk.choices[0]?.delta.content || "");
        }
    }
}

// class OpenAIClient extends LLMProvider {
//     availableModels: string[] = ["gpt-4o-mini", "gpt-4o"];

//     constructor(instance: OpenAI, context: string, model: string) {
//         super(instance, context, model);
//     }

//     protected formatMessages(messages: Message[]): OpenAIMessage[] {
//         const systemMessage = {
//             role: Role.system,
//             content: this.context,
//         };

//         return [
//             systemMessage,
//             ...messages.map(({ role, content }) => ({ role, content })),
//         ];
//     }

//     async checkApiKey(): Promise<boolean> {
//         // Question: In combination with the try/catch/finally block in App.tsx, is this overkill?
//         try {
//             const response = await this.instance.models.list();
//             return response.data.length > 0;
//         } catch (error) {
//             console.error("Error validating OpenAI API key:", error);
//             return false;
//         }
//     }

//     async getSuggestion(
//         messages: Message[],
//         initSuggestion: () => void,
//         appendToSuggestion: (text: string) => void
//     ): Promise<void> {
//         const formattedMessages = this.formatMessages(messages);

//         // Adapted from: https://platform.openai.com/docs/api-reference/streaming
//         const stream = await this.instance.chat.completions.create({
//             model: this.model,
//             messages: formattedMessages,
//             stream: true,
//         });

//         initSuggestion();
//         for await (const chunk of stream) {
//             appendToSuggestion(chunk.choices[0]?.delta?.content || "");
//         }
//     }
// }

export function createLlmApiClient(
    providerName: LlmProviderName,
    apiKey: string
): LlmApiClient<LlmApiClientType> {
    switch (providerName) {
        case LlmProviderName.anthropic:
            return new AnthropicApiClient(apiKey);
        case LlmProviderName.openAi:
            return new OpenAiApiClient(apiKey);
    }
}
