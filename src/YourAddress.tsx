import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export default function YourAddress() {
    const { client } = useLogionClientContext();

    return (
        <p>
            Your address:<br/>
            { client?.currentAddress?.address }
        </p>
    );
}
