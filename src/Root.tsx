import { DraftRequest } from "@logion/client";
import { Container } from "react-bootstrap";
import Header from "./Header";
import DraftRequestCreation from "./DraftRequestCreation";
import RequestSubmission from "./RequestSubmission";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import RequestStatus from "./RequestStatus";
import TemporaryStatus from "./TemporaryStatus";
import IdentityVerification from "./IdentityVerification";
import IdentityResult from "./IdentityResult";

export default function Root() {
    const { errorMessage, sponsorshipState, backendConfig, idenfyResult } = useLogionClientContext();

    const locState = sponsorshipState?.locRequestState;

    return (
        <Container>
            <Header/>
            {
                errorMessage !== null &&
                <TemporaryStatus message={ errorMessage } />
            }
            {
                sponsorshipState !== null && sponsorshipState.locRequestState === undefined &&
                <DraftRequestCreation/>
            }
            {
                sponsorshipState !== null && sponsorshipState.locRequestState instanceof DraftRequest &&
                (!backendConfig?.features.iDenfy || sponsorshipState.locRequestState.data().iDenfy === undefined) &&
                <RequestSubmission request={ sponsorshipState.locRequestState }/>
            }
            {
                sponsorshipState !== null && sponsorshipState.locRequestState instanceof DraftRequest &&
                (backendConfig?.features.iDenfy && sponsorshipState.locRequestState.data().iDenfy !== undefined) &&
                !idenfyResult &&
                <IdentityVerification request={ sponsorshipState.locRequestState }/>
            }
            {
                sponsorshipState !== null && sponsorshipState.locRequestState instanceof DraftRequest &&
                (backendConfig?.features.iDenfy && sponsorshipState.locRequestState.data().iDenfy !== undefined) &&
                idenfyResult &&
                <IdentityResult request={ sponsorshipState.locRequestState } idenfyResult={ idenfyResult }/>
            }
            {
                sponsorshipState !== null && sponsorshipState.locRequestState !== undefined && !(locState instanceof DraftRequest) &&
                <RequestStatus request={ sponsorshipState.locRequestState }/>
            }
        </Container>
    );
}
