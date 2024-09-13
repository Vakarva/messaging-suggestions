import { useState } from "react";
import {
    Button,
    Fieldset,
    NumberInput,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";

import { ClaimContext, LLMProvider } from "@custom-types";

interface SettingsProps {
    close: () => void;
    context: ClaimContext;
    provider: LLMProvider;
    setContext: React.Dispatch<React.SetStateAction<ClaimContext>>;
    setModel: React.Dispatch<React.SetStateAction<string>>;
}

export default function Settings({
    close,
    context,
    provider,
    setContext,
    setModel,
}: SettingsProps) {
    const [tempContext, setTempContext] = useState<ClaimContext>(context);
    const [tempModel, setTempModel] = useState<string>(provider.model);

    function updateTempContext(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setTempContext((prevContext) =>
            Object.assign(new ClaimContext(), prevContext, { [name]: value })
        );
    }

    return (
        <Stack>
            <Fieldset legend="Context">
                <Stack>
                    <TextInput
                        label="Claim ID"
                        name="claimId"
                        onChange={updateTempContext}
                        placeholder="Claim ID"
                        type="text"
                        value={tempContext.claimId}
                    />
                    <TextInput
                        label="Next appointment"
                        name="nextAppointment"
                        onChange={updateTempContext}
                        type="date"
                        value={tempContext.nextAppointment}
                    />
                    <NumberInput
                        decimalScale={2}
                        clampBehavior="strict"
                        hideControls
                        label="Next payment amount"
                        onChange={(value) => {
                            setTempContext((prevContext) =>
                                Object.assign(new ClaimContext(), prevContext, {
                                    nextPaymentAmount: value.toString(),
                                })
                            );
                        }}
                        min={0}
                        name="nextPaymentAmount"
                        placeholder="$0.00"
                        prefix="$"
                        thousandSeparator=","
                        type="text"
                        value={tempContext.nextPaymentAmount}
                    />
                    <TextInput
                        label="Next payment date"
                        name="nextPaymentDate"
                        onChange={updateTempContext}
                        type="date"
                        value={tempContext.nextPaymentDate}
                    />
                </Stack>
            </Fieldset>
            <Fieldset legend="LLM Behavior">
                <Select
                    allowDeselect={false}
                    data={provider.availableModels}
                    label="Model"
                    onChange={(value) => setTempModel(value!)}
                    value={tempModel}
                />
            </Fieldset>
            <Button
                onClick={() => {
                    setContext(tempContext);
                    setModel(tempModel);
                    close();
                }}
                w="100%"
            >
                Save
            </Button>
        </Stack>
    );
}
