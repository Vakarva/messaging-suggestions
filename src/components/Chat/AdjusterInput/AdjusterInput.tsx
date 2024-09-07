import "./AdjusterInput.css";
import { Role } from "../../../types/types";
import ChatInput from "../ChatInput/ChatInput";


export default function AdjusterInput(props: {
    apiKey: string;
    addMessage: (text: string, role: Role) => void;
}) {

    return (
        <div>
            <ChatInput
                addMessage={props.addMessage}
                role={Role.assistant}
            />
        </div>
    );
}