import { useState } from "react";
import {
    Button,
    Fieldset,
    NumberInput,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";
import { NumberFormatValues, SourceInfo } from "react-number-format";

import { LlmHook, useClaimContext } from "@hooks/index";

interface SettingsProps {
    llm: LlmHook;
    close: () => void;
}

export default function Settings({ close, llm }: SettingsProps) {
    const draftClaimContext = useClaimContext(llm.context.data);
    const [draftModelName, setDraftModelName] = useState<string>(
        llm.apiSession.llmName
    );

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        draftClaimContext.update(name, value);
    };

    const handleNumberChange = (
        values: NumberFormatValues,
        sourceInfo: SourceInfo
    ) => {
        const target = sourceInfo.event?.target as HTMLInputElement | undefined; // TS needs help inferring target's type
        if (target) {
            draftClaimContext.update(target.name, values.formattedValue);
        }
    };

    return (
        <Stack>
            <Fieldset legend="Context">
                <Stack>
                    <TextInput
                        label="Claim ID"
                        name="claimId"
                        onChange={handleTextChange}
                        placeholder="Claim ID"
                        type="text"
                        value={draftClaimContext.data.claimId}
                    />
                    <TextInput
                        label="Next appointment"
                        name="nextAppointment"
                        onChange={handleTextChange}
                        type="date"
                        value={draftClaimContext.data.nextAppointment}
                    />
                    <NumberInput
                        decimalScale={2}
                        clampBehavior="strict"
                        hideControls
                        label="Next payment amount"
                        onValueChange={handleNumberChange}
                        min={0}
                        name="nextPaymentAmount"
                        placeholder="$0.00"
                        prefix="$"
                        thousandSeparator=","
                        value={draftClaimContext.data.nextPaymentAmount}
                    />
                    <TextInput
                        label="Next payment date"
                        name="nextPaymentDate"
                        onChange={handleTextChange}
                        type="date"
                        value={draftClaimContext.data.nextPaymentDate}
                    />
                </Stack>
            </Fieldset>
            <Fieldset legend="LLM Behavior">
                <Select
                    allowDeselect={false}
                    data={llm.apiSession.client.getAvailableModels()}
                    label="Model"
                    onChange={(value) => setDraftModelName(value!)} // we know value is not undefined
                    value={draftModelName}
                />
            </Fieldset>
            <Button
                fullWidth
                onClick={() => {
                    llm.updateSettings({
                        newContext: draftClaimContext.data,
                        newName: draftModelName,
                    });
                    close();
                }}
            >
                Save
            </Button>
        </Stack>
    );
}
