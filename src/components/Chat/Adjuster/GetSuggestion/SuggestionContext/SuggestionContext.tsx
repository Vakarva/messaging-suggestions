import { useState } from "react";
import { ClaimContext } from "../../../../../types/types"
import "./SuggestionContext.css"

export default function SuggestionContext(props: {
    context: ClaimContext;
    setContext: React.Dispatch<React.SetStateAction<ClaimContext>>;
}) {
    const [isVisible, setIsVisible] = useState(false);

    function toggleVisibility() {
        setIsVisible(prevIsVisible => !prevIsVisible);
    }

    function updateContext(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        props.setContext(prevContext =>
            Object.assign(
                new ClaimContext(),
                prevContext,
                { [name]: value }
            )
        );
    }

    return (
        <div className="suggestion-settings">
            <button onClick={toggleVisibility}>Settings</button>

            {isVisible &&
                <div className="suggestion-context">
                    <div className="suggestion-context--item">
                        <label htmlFor="claim-id">Claim ID:</label>
                        <input
                            id="claim-id"
                            name="claimId"
                            type="text"
                            placeholder="Claim ID"
                            value={props.context.claimId}
                            onChange={updateContext}
                        />
                    </div>
                    <div className="suggestion-context--item">
                        <label htmlFor="next-appointment">Next appointment:</label>
                        <input
                            id="next-appointment"
                            name="nextAppointment"
                            type="date"
                            value={props.context.nextAppointment}
                            onChange={updateContext}
                        />
                    </div>
                    <div className="suggestion-context--item">
                        <label htmlFor="next-payment-amount">Next payment amount:</label>
                        <input
                            id="next-payment-amount"
                            name="nextPaymentAmount"
                            type="text"
                            placeholder="$0.00"
                            value={props.context.nextPaymentAmount}
                            onChange={updateContext}
                        />
                    </div>
                    <div className="suggestion-context--item">
                        <label htmlFor="next-payment-date">Next payment date:</label>
                        <input
                            id="next-payment-date"
                            name="nextPaymentDate"
                            type="date"
                            value={props.context.nextPaymentDate}
                            onChange={updateContext}
                        />
                    </div>
                </div >
            }
        </div>
    );
}