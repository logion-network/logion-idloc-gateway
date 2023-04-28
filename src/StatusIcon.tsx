import { LocData } from "@logion/client";
import "./StatusIcon.css";

export interface Props {
    loc: LocData;
}

export default function StatusIcon(props: Props) {
    const { loc } = props;
    if(isPending(loc)) {
        return <p className="StatusIcon pending"></p>;
    } else if(isRecorded(loc)) {
        return <p className="StatusIcon recorded"><img src={ `${process.env.PUBLIC_URL}/ok.svg` } height={64} alt="recorded icon"/></p>;
    } else if(isRejected(loc) || isVoided(loc)) {
        return <p className="StatusIcon rejected"><img src={ `${process.env.PUBLIC_URL}/ko.svg` } height={64} alt="rejected icon"/></p>;
    } else {
        return <p className="StatusIcon unknown"></p>;
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
