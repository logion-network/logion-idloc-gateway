import { DraftRequest } from "@logion/client";
import { Button } from "react-bootstrap";
import ButtonBar from "./ButtonBar";
import "./IdentityResult.css";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import StatusIcon from "./StatusIcon";
import { useCancelCallback, useStartIdAmlCheckCallback, useSubmitCallback } from "./Callbacks";

export interface Props {
    request: DraftRequest;
    idenfyResult: string;
}

export default function IdentityResult(props: Props) {
    const { refresh, sponsorshipId } = useLogionClientContext();

    const submit = useSubmitCallback(props.request, refresh);
    const cancel = useCancelCallback(props.request, refresh);
    const start = useStartIdAmlCheckCallback(props.request, sponsorshipId, refresh);

    return (
        <div className="IdentityResult">
            <h2>Identity LOC request status</h2>
            {
                props.idenfyResult === "success" &&
                <>
                    <StatusIcon status="pending"/>
                    <p>ID/AML check: OK.</p>
                </>
            }
            {
                props.idenfyResult === "error" &&
                <>
                    <StatusIcon status="ko"/>
                    <p>ID/AML check: rejected.</p>
                </>
            }
            {
                props.idenfyResult === "unverified" &&
                <>
                    <StatusIcon status="unknown"/>
                    <p>ID/AML check: unverified.</p>
                </>
            }
            <ButtonBar>
            {
                    (props.idenfyResult === "success" || props.idenfyResult === "error") &&
                    <Button
                        variant="danger"
                        onClick={ cancel }
                    >
                        Cancel request
                    </Button>
                }
                {
                    props.idenfyResult === "success" &&
                    <Button
                        onClick={ submit }
                    >
                        Submit request
                    </Button>
                }
                {
                    props.idenfyResult === "error" &&
                    <Button onClick={ start }>
                        Restart the ID/AML check
                    </Button>
                }
            </ButtonBar>
        </div>
    );
}
