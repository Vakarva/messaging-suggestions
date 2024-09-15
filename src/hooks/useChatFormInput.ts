import { useState } from "react";

export interface ChatFormInputHook {
    appendToSuggestion: (text: string) => void;
    initializeSuggestion: () => void;
    isLlmButtonDisabled: boolean;
    isUserButtonDisabled: boolean;
    reset: () => void;
    setText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    text: string;
    toggle: () => void;
}

export function useChatFormInput(): ChatFormInputHook {
    const [isUserTextSelected, setIsUserTextSelected] = useState(true);
    const [suggestionText, setSuggestionText] = useState("");
    const [userText, setUserText] = useState("");

    const text = isUserTextSelected ? userText : suggestionText;
    const isLlmButtonDisabled = !suggestionText || !isUserTextSelected;
    const isUserButtonDisabled = !suggestionText || isUserTextSelected;

    const reset = () => {
        setIsUserTextSelected(true);
        setSuggestionText("");
        setUserText("");
    };

    const appendToSuggestion = (text: string) => {
        setSuggestionText((oldValue) => oldValue + text);
    };

    const initializeSuggestion = () => {
        setSuggestionText(""); // clear suggestion text
        setIsUserTextSelected(false); // select LLM's suggested text
    };

    const toggle = () => {
        setIsUserTextSelected((oldValue) => !oldValue);
    };

    const setText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (isUserTextSelected) {
            setUserText(text);
        } else {
            setSuggestionText(text);
        }
    };

    return {
        appendToSuggestion,
        initializeSuggestion,
        isLlmButtonDisabled,
        isUserButtonDisabled,
        reset,
        setText,
        text,
        toggle,
    };
}
