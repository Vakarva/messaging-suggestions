// Simple types
export enum Role {
    assistant = "assistant",
    user = "user",
}

export interface Message {
    content: string;
    createdAt: Date;
    role: Role;
}

// LLM API Client classes
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

    abstract isApiKeyValid(): Promise<boolean>;
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

interface AnthropicMessage {
    role: "user" | "assistant";
    content: string;
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

    async isApiKeyValid(): Promise<boolean> {
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

    protected formatMessages(messages: Message[]): AnthropicMessage[] {
        return [...messages.map(({ role, content }) => ({ role, content }))];
    }
    async getStream(prompt: string, messages: Message[], model: string) {
        const formattedMessages = this.formatMessages(messages);

        const stream = await this.instance.messages.stream({
            system: prompt,
            messages: formattedMessages,
            model: model,
            max_tokens: 512,
            stream: true,
        });
        return stream;
    }

    async writeStream(
        stream: any,
        initializeOutput: () => void,
        appendToOutput: (text: string) => void
    ) {
        initializeOutput();
        stream.on("text", appendToOutput);
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

    async isApiKeyValid(): Promise<boolean> {
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
