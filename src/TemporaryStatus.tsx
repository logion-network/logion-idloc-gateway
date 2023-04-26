import Centered from "./Centered";

interface Props {
    message: string
}

export default function TemporaryStatus(props: Props)  {
    return <Centered>{ props.message }</Centered>
}
