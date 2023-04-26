import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export default function LegalOfficer() {

    const { sponsorshipState } = useLogionClientContext();

    if (sponsorshipState === null || sponsorshipState.legalOfficer === undefined) {
        return null;
    }

    return (
        <p className="LegalOfficer">
            Your Legal Officer:<br />
            { sponsorshipState.legalOfficer.name }<br />
            { sponsorshipState.legalOfficer.userIdentity.email }
        </p>
    )
}
