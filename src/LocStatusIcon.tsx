import { LocData } from "@logion/client";
import StatusIcon from "./StatusIcon";

export interface Props {
    loc: LocData;
}

export default function LocStatusIcon(props: Props) {
    const { loc } = props;
    if(isPending(loc)) {
        return <StatusIcon status="pending"/>;
    } else if(isRecorded(loc)) {
        return <StatusIcon status="ok"/>;
    } else if(isRejected(loc) || isVoided(loc)) {
        return <StatusIcon status="ko"/>;
    } else {
        return <StatusIcon status="unknown"/>;
    }
}

export function isPending(loc: LocData) {
    return !isVoided(loc) && (loc.status === "REQUESTED" || loc.status === "OPEN");
}

export function isRecorded(loc: LocData) {
    return !isVoided(loc) && loc.status === "CLOSED";
}

export function isRejected(loc: LocData) {
    return !isVoided(loc) && loc.status === "REJECTED";
}

export function isVoided(loc: LocData) {
    return loc.voidInfo !== undefined
}
