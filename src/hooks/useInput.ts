import { useEffect, useState } from "react";

import { Role } from "@custom-types";

export enum TextSelection {
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
    textSelection: TextSelection;
    toggleRole: () => void;
    undo: () => void;
}

export default function useInput(): InputHook {
    const [role, setRole] = useState<Role>(Role.user);
    const [_userTextBox, _setUserTextBox] = useState("");
    const [_llmTextBox, _setLlmTextBox] = useState("");
    const [textSelection, _setTextSelection] = useState(TextSelection.USER);

    const text =
        textSelection === TextSelection.USER ? _userTextBox : _llmTextBox;
    const isEmpty = text.trim() === "";
    const isRedoDisabled = !_llmTextBox || textSelection === TextSelection.LLM;
    const isUndoDisabled = textSelection === TextSelection.USER;

    const append = (text: string) => {
        _setLlmTextBox((oldValue) => oldValue + text);
    };

    // Prepare input to receive LLM's response
    const initialize = () => {
        _setLlmTextBox("");
        _setTextSelection(TextSelection.LLM);
    };

    const redo = () => {
        if (!isRedoDisabled) {
            _setTextSelection(TextSelection.LLM);
        }
    };

    const reset = () => {
        _setTextSelection(TextSelection.USER);
        _setLlmTextBox("");
        _setUserTextBox("");
    };

    const setText = (text: string) => {
        if (textSelection === TextSelection.USER) {
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
        if (!isUndoDisabled) {
            _setTextSelection(TextSelection.USER);
        }
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
        textSelection,
        toggleRole,
        undo,
    };
}
