import { useState } from "react";
import {
    Button,
    Fieldset,
    NumberInput,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";

import { ClaimContext } from "@custom-types";

interface SettingsProps {
    close: () => void;
    context: ClaimContext;
    setContext: React.Dispatch<React.SetStateAction<ClaimContext>>;
}

export default function Settings({
    close,
    context,
    setContext,
}: SettingsProps) {
    const [tempContext, setTempContext] = useState<ClaimContext>(context);

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
            <Fieldset legend="LLM Settings">
                <Stack>
                    <Select
                        allowDeselect={false}
                        data={["gpt-4o-mini", "gpt-4o"]}
                        defaultValue={"gpt-4o-mini"}
                    />
                </Stack>
            </Fieldset>
            <Button
                ml="auto"
                onClick={() => {
                    setContext(tempContext);
                    close();
                }}
            >
                Update
            </Button>
        </Stack>
    );
}
