import { useEffect, useState } from "react";

import { Role } from "@custom-types";

enum TextSelection {
    USER,
    LLM,
}

export interface InputHook {
    append: (text: string) => void;
    initialize: () => void;
    isEmpty: boolean;
    isRedoDisabled: boolean;
    isUndoDisabled: boolean;
    redo: () => void;
    reset: () => void;
    role: Role;
    setRole: (role: Role) => void;
    setText: (text: string) => void;
    text: string;
    toggleRole: () => void;
    undo: () => void;
}

export function useInput(): InputHook {
    const [role, setRole] = useState<Role>(Role.user);
    const [_userTextBox, _setUserTextBox] = useState("");
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

    // Prepare input to receive LLM's response
    const initialize = () => {
        _setLlmTextBox("");
        _setTextSelection(TextSelection.LLM);
    };

    const redo = () => {
        _setTextSelection(TextSelection.LLM);
    };

    const reset = () => {
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

    const toggleRole = () => {
        setRole((oldRole) =>
            oldRole === Role.user ? Role.assistant : Role.user
        );
    };

    const undo = () => {
        _setTextSelection(TextSelection.USER);
    };

    // We don't want input to persist when role changes
    // In production, we won't need this because there will be no role switching
    useEffect(reset, [role]);

    return {
        append,
        initialize,
        isEmpty,
        isRedoDisabled,
        isUndoDisabled,
        redo,
        reset,
        role,
        setRole,
        setText,
        text,
        toggleRole,
        undo,
    };
}
