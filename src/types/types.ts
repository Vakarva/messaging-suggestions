export enum Role {
    user = "user",
    assistant = "assistant"
}

export interface Message {
    id: string;
    content: string;
    role: Role;
}