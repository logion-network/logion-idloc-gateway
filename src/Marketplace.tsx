import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export default function Marketplace() {
    const { sponsorshipState } = useLogionClientContext();

    if (sponsorshipState === null) {
        return null;
    }

    return <p>Marketplace ID: { sponsorshipState.sponsorship.sponsor.address }</p>;
}
