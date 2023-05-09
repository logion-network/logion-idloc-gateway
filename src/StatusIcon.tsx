import "./StatusIcon.css";

export interface Props {
    status: "pending" | "ok" | "ko" | "unknown";
}

export default function StatusIcon(props: Props) {
    if(props.status === "pending") {
        return <p className="StatusIcon pending"></p>;
    } else if(props.status === "ok") {
        return <p className="StatusIcon recorded"><img src={ `${process.env.PUBLIC_URL}/ok.svg` } height={64} alt="recorded icon"/></p>;
    } else if(props.status === "ko") {
        return <p className="StatusIcon rejected"><img src={ `${process.env.PUBLIC_URL}/ko.svg` } height={64} alt="rejected icon"/></p>;
    } else {
        return <p className="StatusIcon unknown"></p>;
    }
}
