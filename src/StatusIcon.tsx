import { LocRequestStatus } from "@logion/client";
import "./StatusIcon.css";

export interface Props {
    status: LocRequestStatus;
}

export default function StatusIcon(props: Props) {
    if(isPending(props.status)) {
        return <p className="StatusIcon pending"></p>;
    } else if(isRecorded(props.status)) {
        return <p className="StatusIcon recorded"><img src={ `${process.env.PUBLIC_URL}/ok.svg` } height={64} alt="recorded icon"/></p>;
    } else if(isRejected(props.status)) {
        return <p className="StatusIcon rejected"><img src={ `${process.env.PUBLIC_URL}/ko.svg` } height={64} alt="rejected icon"/></p>;
    } else {
        return <p className="StatusIcon unknown"></p>;
    }
}

export function isPending(status: LocRequestStatus) {
    return status === "REQUESTED" || status === "OPEN";
}

export function isRecorded(status: LocRequestStatus) {
    return status === "CLOSED";
}

export function isRejected(status: LocRequestStatus) {
    return status === "REJECTED";
}
