import { ReactNode } from "react";
import "./Centered.css";

export interface Props {
    children: ReactNode;
}

export default function Centered(props: Props) {
    return (
        <div className="Centered">
            { props.children }
        </div>
    );
}
