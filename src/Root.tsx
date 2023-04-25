import { DraftRequest, LegalOfficerClass, LocRequest, LocRequestState, LocSharedState, hashString } from "@logion/client";
import { AxiosInstance } from "axios";
import { useCallback, useMemo } from "react";
import { Container } from "react-bootstrap";
import Header from "./Header";
import DraftRequestCreation from "./DraftRequestCreation";
import RequestSubmission from "./RequestSubmission";
import { PROCESS_FILE_NATURE, PROOF_FILE_NATURE } from "./Template";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";

export default function Root() {
    const { client } = useLogionClientContext();

    const buildFile = useCallback((nature: string) => {
        return {
            contentType: "application/pdf",
            hash: hashString(nature),
            name: "process_file.pdf",
            nature: nature,
            published: false,
            restrictedDelivery: false,
            size: 4n,
            submitter: client?.currentAddress,
        };
    }, [ client?.currentAddress ]);

    const locState = useMemo<LocRequestState | undefined>(() => { // TODO request state should be provided by the context

        // Uncomment a return statement to test screen

        // DraftRequestCreation
        // return undefined;

        // RequestSubmission
        return new DraftRequest(
            {
                allLegalOfficers: [
                    LEGAL_OFFICER
                ],
            } as unknown as LocSharedState,
            {
                ownerAddress: LEGAL_OFFICER.address,
                userIdentity: USER_IDENTITY,
                userPostalAddress: USER_ADDRESS,
                metadata: [],
                files: client?.currentAddress ? [
                    buildFile(PROCESS_FILE_NATURE),
                    buildFile(PROOF_FILE_NATURE),
                ] : [],
                links: [],
            } as unknown as LocRequest,
            undefined,
            LOC_VERIFIED_ISSUERS,
        );

    }, [ client?.currentAddress, buildFile ]);

    return (
        <Container>
            <Header/>
            {
                locState === undefined &&
                <DraftRequestCreation/>
            }
            {
                locState instanceof DraftRequest &&
                <RequestSubmission request={ locState }/>
            }
        </Container>
    );
}

const LEGAL_OFFICER = new LegalOfficerClass({
    legalOfficer: {
        userIdentity: {
            firstName: "Alice",
            lastName: "Network",
            email: "alice@logion.network",
            phoneNumber: "+1234",
        },
        postalAddress: {
            line1: "",
            line2: "",
            city: "",
            company: "",
            country: "",
            postalCode: "",
        },
        address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        additionalDetails: "",
        node: "https://dev-node01.logion.network",
        name: "Alice Network",
        logoUrl: "",
        nodeId: "12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2",
    },
    axiosFactory: { buildAxiosInstance: () => ({} as unknown as AxiosInstance) },
});

const USER_IDENTITY = {
    firstName: "John",
    lastName: "Doe",
    email: "john",
    phoneNumber: "+1234",
};

const USER_ADDRESS = {
    line1: "?",
    line2: "",
    city: "?",
    company: "?",
    country: "?",
    postalCode: "?",
};

const LOC_VERIFIED_ISSUERS = {
    verifiedThirdParty: false,
    issuers: [],
};
