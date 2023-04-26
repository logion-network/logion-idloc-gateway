import { LocRequestState, RejectedRequest } from "@logion/client";
import { useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import config from './config/index';
import StatusIcon, { isPending, isRecorded, isRejected } from "./StatusIcon";
import "./RequestStatus.css";
import ButtonBar from "./ButtonBar";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export interface Props {
    request: LocRequestState;
}

export default function RequestStatus(props: Props) {

    const status = useMemo(() => props.request.data().status, [ props.request ]);
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
            <StatusIcon status={ status }/>
            {
                isPending(status) &&
                <p>Pending</p>
            }
            {
                isRejected(status) &&
                <>
                    <p>Rejected.</p>
                    <p>Reason: { props.request.data().rejectReason }</p>
                    <ButtonBar>
                        <Button onClick={ restart }>Restart the process</Button>
                    </ButtonBar>
                </>
            }
            {
                isRecorded(status) &&
                <>
                    <p>Your identity credentials are recorded by logion.</p>
                    <p><a href={ `https://${ config.certificateHost }/public/certificate/${ props.request.data().id.toDecimalString() }` }>Identity LOC Certificate</a></p>
                </>
            }
        </div>
    );
}
