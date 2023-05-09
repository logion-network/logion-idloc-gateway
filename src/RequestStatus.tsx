import { LocRequestState, RejectedRequest } from "@logion/client";
import { useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import config from './config/index';
import LocStatusIcon, { isPending, isRecorded, isRejected, isVoided } from "./LocStatusIcon";
import "./RequestStatus.css";
import ButtonBar from "./ButtonBar";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export interface Props {
    request: LocRequestState;
}

export default function RequestStatus(props: Props) {

    const loc = useMemo(() => props.request.data(), [ props.request ]);
    const { refresh } = useLogionClientContext();
    const restart = useCallback(async () => {
        if(props.request instanceof RejectedRequest) {
            await props.request.cancel();
            await refresh();
        }
    }, [ props.request, refresh ]);

    return (
        <div className="RequestStatus">
            <h2>Identity LOC request status</h2>
            <LocStatusIcon loc={ loc }/>
            {
                isPending(loc) &&
                <p>Pending</p>
            }
            {
                isRejected(loc) &&
                <>
                    <p>Rejected.</p>
                    <p>Reason: { props.request.data().rejectReason }</p>
                    <ButtonBar>
                        <Button onClick={ restart }>Restart the process</Button>
                    </ButtonBar>
                </>
            }
            {
                isRecorded(loc) &&
                <>
                    <p>Your identity credentials are recorded by logion.</p>
                    <p><a href={ `https://${ config.certificateHost }/public/certificate/${ props.request.data().id.toDecimalString() }` }>Identity LOC Certificate</a></p>
                </>
            }
            {
                isVoided(loc) &&
                <>
                    <p>Your identity credentials are voided by your Legal Officer.</p>
                    <p>Reason: { props.request.data().voidInfo?.reason }</p>
                    <p><a href={ `https://${ config.certificateHost }/public/certificate/${ props.request.data().id.toDecimalString() }` }>Identity LOC Certificate</a></p>
                </>
            }
        </div>
    );
}
