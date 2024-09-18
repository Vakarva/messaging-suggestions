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
    toggleRole: () => void;
    undo: () => void;
}

export function useChatForm(): ChatFormHook {
    const [role, setRole] = useState<Role>(Role.user);
    const [_userTextBox, _setUserTextBox] = useState("");
    const messages = useMessages();
    const [_llmTextBox, _setLlmTextBox] = useState("");
    const [_textSelection, _setTextSelection] = useState(TextSelection.USER);

    const text =
        _textSelection === TextSelection.USER ? _userTextBox : _llmTextBox;
    const isEmpty = text.trim() === "";
    const isRedoDisabled = !_llmTextBox || _textSelection === TextSelection.LLM;
    const isUndoDisabled =
        !_llmTextBox || _textSelection === TextSelection.USER;

    const append = (text: string) => {
        _setLlmTextBox((oldValue) => oldValue + text);
    };

    const initialize = () => {
        _setLlmTextBox(""); // clear suggestion text
        _setTextSelection(TextSelection.LLM); // select LLM's suggested text
    };

    const redo = () => {
        _setTextSelection(TextSelection.LLM);
    };

    const _resetText = () => {
        _setTextSelection(TextSelection.USER);
        _setLlmTextBox("");
        _setUserTextBox("");
    };

    const setText = (text: string) => {
        if (_textSelection === TextSelection.USER) {
            _setUserTextBox(text);
        } else {
            _setLlmTextBox(text);
        }
    };

    const submit = () => {
        messages.append(text.trim(), role);
        _resetText();
    };

    const toggleRole = () => {
        setRole((oldRole) =>
            oldRole === Role.user ? Role.assistant : Role.user
        );
    };

    const undo = () => {
        _setTextSelection(TextSelection.USER);
    };

    // We don't want the inputs to be populated when the role changes
    // In the real app we wouldn't need this because there would be no role switching
    useEffect(_resetText, [role]);

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
        toggleRole,
        undo,
    };
}
