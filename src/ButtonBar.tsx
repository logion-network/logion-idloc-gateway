import "./ButtonBar.css";

export interface Props {
    children: React.ReactNode;
}

export default function ButtonBar(props: Props) {
    return (
        <div className="ButtonBar">
            { props.children }
        </div>
    );
}
