import { useState } from "react";
import {
    Button,
    Fieldset,
    NumberInput,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";

import { useClaimContext } from "@hooks/useClaimContext";
import { ChatHook } from "@hooks/useChat";

interface SettingsProps {
    chat: ChatHook;
    close: () => void;
}

export default function Settings({ close, chat }: SettingsProps) {
    const draftClaimContext = useClaimContext(chat.claimContext);
    const [draftModelName, setDraftModelName] = useState<string>(
        chat.llm.modelName
    );

    return (
        <Stack>
            <Fieldset legend="Context">
                <Stack>
                    <TextInput
                        label="Claim ID"
                        name="claimId"
                        onChange={draftClaimContext.handleTextInputChange}
                        placeholder="Claim ID"
                        type="text"
                        value={draftClaimContext.claimId}
                    />
                    <TextInput
                        label="Next appointment"
                        name="nextAppointment"
                        onChange={draftClaimContext.handleTextInputChange}
                        type="date"
                        value={draftClaimContext.nextAppointment}
                    />
                    <NumberInput
                        decimalScale={2}
                        clampBehavior="strict"
                        hideControls
                        label="Next payment amount"
                        onValueChange={
                            draftClaimContext.handleNumberInputChange
                        }
                        min={0}
                        name="nextPaymentAmount"
                        placeholder="$0.00"
                        prefix="$"
                        thousandSeparator=","
                        type="text"
                        value={draftClaimContext.nextPaymentAmount}
                    />
                    <TextInput
                        label="Next payment date"
                        name="nextPaymentDate"
                        onChange={draftClaimContext.handleTextInputChange}
                        type="date"
                        value={draftClaimContext.nextPaymentDate}
                    />
                </Stack>
            </Fieldset>
            <Fieldset legend="LLM Behavior">
                <Select
                    allowDeselect={false}
                    data={chat.llm.apiSession.client.getAvailableModels()}
                    label="Model"
                    onChange={(value) => setDraftModelName(value!)}
                    value={draftModelName}
                />
            </Fieldset>
            <Button
                onClick={() => {
                    chat.updateLlmSettings({
                        newClaimContext: draftClaimContext,
                        newLlmModelName: draftModelName,
                    });
                    close();
                }}
                w="100%"
            >
                Save
            </Button>
        </Stack>
    );
}
