import { useEffect, useState } from "react";

import { Role } from "@custom-types";

import { MessagesHook, useMessages } from "@hooks/useMessages";

enum TextSelection {
    USER,
    LLM,
}

export interface ChatFormHook {
    append: (text: string) => void;
    initialize: () => void;
    isEmpty: boolean;
    isRedoDisabled: boolean;
    isUndoDisabled: boolean;
    messages: MessagesHook;
    redo: () => void;
    role: Role;
    setRole: (role: Role) => void;
    setText: (text: string) => void;
    submit: () => void;
    text: string;
    undo: () => void;
}

export function useChatForm(): ChatFormHook {
    const [role, setRole] = useState<Role>(Role.user);
    const [userTextBox, setUserTextBox] = useState("");
    const messages = useMessages();
    const [llmTextBox, setLlmTextBox] = useState("");
    const [textSelection, setTextSelection] = useState(TextSelection.USER);

    const text =
        textSelection === TextSelection.USER ? userTextBox : llmTextBox;
    const isEmpty = text.trim() === "";
    const isUndoDisabled = !llmTextBox || textSelection === TextSelection.USER;
    const isRedoDisabled = !llmTextBox || textSelection === TextSelection.LLM;

    // Clear inputs when role changes
    useEffect(resetText, [role]);

    const append = (text: string) => {
        setLlmTextBox((oldValue) => oldValue + text);
    };

    const initialize = () => {
        setLlmTextBox(""); // clear suggestion text
        setTextSelection(TextSelection.LLM); // select LLM's suggested text
    };

    const redo = () => {
        setTextSelection(TextSelection.LLM);
    };

    function resetText() {
        setTextSelection(TextSelection.USER);
        setLlmTextBox("");
        setUserTextBox("");
    }

    const setText = (text: string) => {
        if (textSelection === TextSelection.USER) {
            setUserTextBox(text);
        } else {
            setLlmTextBox(text);
        }
    };

    const submit = () => {
        messages.append(text.trim(), role);
        resetText();
    };

    const undo = () => {
        setTextSelection(TextSelection.USER);
    };

    return {
        append,
        initialize,
        isEmpty,
        isRedoDisabled,
        isUndoDisabled,
        messages,
        redo,
        role,
        setRole,
        setText,
        submit,
        text,
        undo,
    };
}
