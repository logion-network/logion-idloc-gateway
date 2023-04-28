import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export default function Sponsor() {
    const { sponsorshipState } = useLogionClientContext();

    if (sponsorshipState === null) {
        return null;
    }

    return <p>Sponsor ID: { sponsorshipState.sponsorship.sponsor.address }</p>;
}
