import { DraftRequest } from "@logion/client";
import { useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import "./IdentityVerification.css";
import ButtonBar from "./ButtonBar";
import { useCancelCallback, useStartIdAmlCheckCallback, useSubmitCallback } from "./Callbacks";

export interface Props {
    request: DraftRequest;
}

export default function IdentityVerification(props: Props) {
    const { refresh, sponsorshipId } = useLogionClientContext();

    const iDenfy = useMemo(() => {
        return props.request.data().iDenfy;
    }, [ props.request ]);

    const resume = useCallback(() => {
        window.location.href = props.request.iDenfySessionUrl;
    }, [ props.request ]);

    const submit = useSubmitCallback(props.request, refresh);
    const cancel = useCancelCallback(props.request, refresh);
    const start = useStartIdAmlCheckCallback(props.request, sponsorshipId);

    return (
        <div className="IdentityVerification">
            <h2>Identity Check</h2>
            {
                iDenfy?.status !== "APPROVED" &&
                <p>You are about to start or resume the ID/AML check through iDenfy.</p>
            }
            {
                iDenfy?.status === "APPROVED" &&
                <p>You completed successfully the ID/AML check through iDenfy, you may now submit your request.</p>
            }
            <ButtonBar>
            {
                !props.request.isIDenfySessionInProgress() && iDenfy?.status !== "APPROVED" &&
                <Button
                    variant="danger"
                    onClick={ cancel }
                >
                    Cancel request
                </Button>
            }
            {
                !props.request.isIDenfySessionInProgress() && iDenfy?.status !== "APPROVED" &&
                <Button onClick={ start }>
                    Start ID/AML check through iDenfy
                </Button>
            }
            {
                props.request.isIDenfySessionInProgress() &&
                <Button onClick={ resume }>
                    Resume ID/AML check through iDenfy
                </Button>
            }
            {
                iDenfy?.status === "APPROVED" &&
                <Button onClick={ submit }>
                    Submit request
                </Button>
            }
            </ButtonBar>
        </div>
    );
}
