export enum Role {
    assistant = "assistant",
    user = "user",
    system = "system"
}

export interface Message {
    id: string;
    role: Role;
    content: string;
}