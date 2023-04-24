import { Container } from "react-bootstrap";
import Header from "./Header";
import { useMemo } from "react";
import { Status } from "./Types";
import DraftRequestCreation from "./DraftRequestCreation";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export default function Root() {
    const { client } = useLogionClientContext();

    const status = useMemo(() => { // TODO current status should be provided by the context
        if(client?.currentAddress) {
            return Status.NO_REQUEST; // Adjust to test screen
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
        </Container>
    );
}
