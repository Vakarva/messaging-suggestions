/* Simple types */
export enum Role {
    assistant = "assistant",
    user = "user",
}

export interface Message {
    content: string;
    createdAt: Date;
    role: Role;
}

/* LLM API Client Objects */
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export enum LlmProviderName {
    anthropic = "Anthropic",
    openAi = "OpenAI",
}

export interface LlmApiClient {
    getAvailableModels: () => string[];
    getDefaultModelName: () => string;

    getStream: (
        prompt: string,
        messages: Message[],
        model: string
    ) => Promise<AsyncGenerator<string>>;

    validateApiKey: () => Promise<void>;
}

interface AnthropicMessage {
    role: "user" | "assistant";
    content: string;
}

function AnthropicApiClient(apiKey: string): LlmApiClient {
    const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });
    const _availableModels = [
        "claude-3-haiku-20240307",
        "claude-3-5-sonnet-20240620",
    ];
    const _defaultModelName = _availableModels[0];

    // Anthropic requires that messages alternate between user and assistant
    const _mergedAndFormatted = (messages: Message[]): AnthropicMessage[] => {
        return messages.reduce<AnthropicMessage[]>((acc, message, index) => {
            if (index === 0) {
                acc.push({
                    role: message.role,
                    content: message.content,
                });
            } else {
                const prevMessage = acc[acc.length - 1];

                if (prevMessage.role === message.role) {
                    prevMessage.content += `\n${message.content}`;
                } else {
                    acc.push({
                        role: message.role,
                        content: message.content,
                    });
                }
            }
            return acc;
        }, []);
    };

    const getStream = async (
        prompt: string,
        messages: Message[],
        model: string
    ): Promise<AsyncGenerator<string>> => {
        const mergedAndFormattedMessages = _mergedAndFormatted(messages);

        try {
            const stream = await anthropic.messages.stream({
                system: prompt,
                messages: mergedAndFormattedMessages,
                model: model,
                max_tokens: 512,
                stream: true,
            });
            // AsyncGenerator needed to make stream generic for various API providers
            // Anthropic's streaming API: https://docs.anthropic.com/en/api/messages-streaming
            async function* streamGenerator(): AsyncGenerator<string> {
                for await (const event of stream) {
                    if (
                        event.type === "content_block_delta" &&
                        event.delta.type === "text_delta"
                    ) {
                        yield event.delta.text;
                    }
                }
            }

            return streamGenerator();
        } catch (error) {
            throw new Error("Error getting Anthropic stream", { cause: error });
        }
    };

    const validateApiKey = async (): Promise<void> => {
        try {
            await anthropic.messages.create({
                model: _defaultModelName,
                max_tokens: 1,
                messages: [{ role: "user", content: "Test" }],
            });
        } catch (error) {
            throw new Error("Error validating Anthropic API key", {
                cause: error,
            });
        }
    };

    return {
        getAvailableModels: () => _availableModels,
        getDefaultModelName: () => _defaultModelName,
        getStream,
        validateApiKey,
    };
}

interface OpenAiMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

function OpenAiApiClient(apiKey: string): LlmApiClient {
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });
    const _availableModels = ["gpt-4o-mini", "gpt-4o"];
    const _defaultModelName = _availableModels[0];

    const _formatted = (
        prompt: string,
        messages: Message[]
    ): OpenAiMessage[] => {
        const systemMessage = {
            role: "system",
            content: prompt,
        } as OpenAiMessage;

        return [
            systemMessage,
            ...messages.map(({ role, content }) => ({ role, content })),
        ];
    };

    const getStream = async (
        prompt: string,
        messages: Message[],
        model: string
    ): Promise<AsyncGenerator<string>> => {
        const formattedMessages = _formatted(prompt, messages);

        try {
            const stream = await openai.chat.completions.create({
                model: model,
                messages: formattedMessages,
                stream: true,
            });
            // OpenAI's streaming API: https://platform.openai.com/docs/api-reference/chat/streaming
            async function* streamGenerator(): AsyncGenerator<string> {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        yield content;
                    }
                }
            }

            return streamGenerator();
        } catch (error) {
            throw new Error("Error getting OpenAI stream", { cause: error });
        }
    };

    const validateApiKey = async (): Promise<void> => {
        try {
            await openai.models.list();
        } catch (error) {
            throw new Error("Error validating OpenAI API key", {
                cause: error,
            });
        }
    };

    return {
        getAvailableModels: () => _availableModels,
        getDefaultModelName: () => _defaultModelName,
        getStream,
        validateApiKey,
    };
}

export function createLlmApiClient(
    providerName: LlmProviderName,
    apiKey: string
): LlmApiClient {
    switch (providerName) {
        case LlmProviderName.anthropic:
            return AnthropicApiClient(apiKey);
        case LlmProviderName.openAi:
            return OpenAiApiClient(apiKey);
    }
}
