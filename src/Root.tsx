import { Container } from "react-bootstrap";
import Header from "./Header";
import { useMemo } from "react";
import { Status } from "./Types";
import DraftRequestCreation from "./DraftRequestCreation";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import RequestSubmission from "./RequestSubmission";

export default function Root() {
    const { client } = useLogionClientContext();

    const status = useMemo<Status>(() => { // TODO current status should be provided by the context
        if(client?.currentAddress) {
            // Uncomment to test screen
            // return Status.NO_REQUEST;
            return Status.DRAFT_REQUEST;
        } else {
            return Status.NOT_CONNECTED;
        }
    }, [ client ]);

    return (
        <Container>
            <Header/>
            {
                status === Status.NO_REQUEST &&
                <DraftRequestCreation/>
            }
            {
                status === Status.DRAFT_REQUEST &&
                <RequestSubmission/>
            }
        </Container>
    );
}
