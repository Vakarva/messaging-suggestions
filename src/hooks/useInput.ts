import { useState } from "react";

import { Role } from "@custom-types";

export enum TextSelection {
    HUMAN,
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
    setText: (text: string) => void;
    text: string;
    textSelection: TextSelection;
    toggleRole: () => void;
    undo: () => void;
}

export default function useInput(): InputHook {
    const [role, _setRole] = useState<Role>(Role.user);
    const [_userTextBox, _setUserTextBox] = useState("");
    const [_llmTextBox, _setLlmTextBox] = useState("");
    const [textSelection, _setTextSelection] = useState(TextSelection.HUMAN);

    const text =
        textSelection === TextSelection.HUMAN ? _userTextBox : _llmTextBox;
    const isEmpty = text.trim() === "";
    const isRedoDisabled = !_llmTextBox || textSelection === TextSelection.LLM;
    const isUndoDisabled = textSelection === TextSelection.HUMAN;

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
        _setTextSelection(TextSelection.HUMAN);
        _setLlmTextBox("");
        _setUserTextBox("");
    };

    const setText = (text: string) => {
        if (textSelection === TextSelection.HUMAN) {
            _setUserTextBox(text);
        } else {
            _setLlmTextBox(text);
        }
    };

    const toggleRole = () => {
        _setRole((oldRole) =>
            oldRole === Role.user ? Role.assistant : Role.user
        );
        reset(); // We don't want input to persist when role changes
    };

    const undo = () => {
        if (!isUndoDisabled) {
            _setTextSelection(TextSelection.HUMAN);
        }
    };

    return {
        append,
        initialize,
        isEmpty,
        isRedoDisabled,
        isUndoDisabled,
        redo,
        reset,
        role,
        setText,
        text,
        textSelection,
        toggleRole,
        undo,
    };
}
