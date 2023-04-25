import { ClosedLoc, DraftRequest, LegalOfficerClass, LocRequest, LocRequestState, LocSharedState, hashString, PendingRequest, OpenLoc, RejectedRequest } from "@logion/client";
import { LegalOfficerCase } from "@logion/node-api";
import { AxiosInstance } from "axios";
import { useCallback, useMemo } from "react";
import { Container } from "react-bootstrap";
import Header from "./Header";
import DraftRequestCreation from "./DraftRequestCreation";
import RequestSubmission from "./RequestSubmission";
import { PROCESS_FILE_NATURE, PROOF_FILE_NATURE } from "./Template";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import RequestStatus from "./RequestStatus";

export default function Root() {
    const { client } = useLogionClientContext();

    const buildFile = useCallback((nature: string) => {
        return {
            contentType: "application/pdf",
            hash: hashString(nature),
            name: "file.pdf",
            nature: nature,
            published: false,
            restrictedDelivery: false,
            size: 4n,
            submitter: client?.currentAddress,
        };
    }, [ client?.currentAddress ]);

    const buildChainFile = useCallback((nature: string) => {
        return {
            hash: hashString(nature),
            name: "file.pdf",
            nature: nature,
            size: 4n,
            submitter: client?.currentAddress,
        };
    }, [ client?.currentAddress ]);

    const locState = useMemo<LocRequestState | undefined>(() => { // TODO request state should be provided by the context
        if(!client?.currentAddress) {
            return undefined;
        }

        type ScreenType =
            "DraftRequestCreation" |
            "RequestSubmission" |
            "RequestStatusPendingPending" |
            "RequestStatusRejected" |
            "RequestStatusPendingOpen" |
            "RequestStatusRecorded" |
            string;

        let screen: ScreenType = "DraftRequestCreation"; // Pick one screen to test in the list above
        let request: LocRequestState | undefined;

        if(screen === "DraftRequestCreation") {
            request = undefined;
        } else if(screen === "RequestSubmission") {
            request = new DraftRequest(
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
                    files: [
                        buildFile(PROCESS_FILE_NATURE),
                        buildFile(PROOF_FILE_NATURE),
                    ],
                    links: [],
                    status: "DRAFT",
                } as unknown as LocRequest,
                undefined,
                LOC_VERIFIED_ISSUERS,
            );
        } else if(screen === "RequestStatusPendingPending") {
            request = new PendingRequest(
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
                    files: [
                        buildFile(PROCESS_FILE_NATURE),
                        buildFile(PROOF_FILE_NATURE),
                    ],
                    links: [],
                    status: "REQUESTED",
                } as unknown as LocRequest,
                undefined,
                LOC_VERIFIED_ISSUERS,
            );
        } else if(screen === "RequestStatusRejected") {
            request = new RejectedRequest(
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
                    files: [
                        buildFile(PROCESS_FILE_NATURE),
                        buildFile(PROOF_FILE_NATURE),
                    ],
                    links: [],
                    status: "REJECTED",
                    rejectReason: "Wrong data.",
                } as unknown as LocRequest,
                undefined,
                LOC_VERIFIED_ISSUERS,
            );
        } else if(screen === "RequestStatusPendingOpen") {
            request = new OpenLoc(
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
                    files: [
                        buildFile(PROCESS_FILE_NATURE),
                        buildFile(PROOF_FILE_NATURE),
                    ],
                    links: [],
                    status: "OPEN",
                } as unknown as LocRequest,
                {
                    files: [
                        buildChainFile(PROCESS_FILE_NATURE),
                        buildChainFile(PROOF_FILE_NATURE),
                    ],
                } as unknown as LegalOfficerCase,
                LOC_VERIFIED_ISSUERS,
            );
        } else {
            request = new ClosedLoc(
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
                    files: [
                        buildFile(PROCESS_FILE_NATURE),
                        buildFile(PROOF_FILE_NATURE),
                    ],
                    links: [],
                    status: "CLOSED",
                } as unknown as LocRequest,
                {
                    files: [
                        buildChainFile(PROCESS_FILE_NATURE),
                        buildChainFile(PROOF_FILE_NATURE),
                    ],
                } as unknown as LegalOfficerCase,
                LOC_VERIFIED_ISSUERS,
            );
        }

        return request;
    }, [ client?.currentAddress, buildFile, buildChainFile ]);

    return (
        <Container>
            <Header/>
            { /* TODO display nothing as long as sponsorship was not retrieved */}
            {
                locState === undefined &&
                <DraftRequestCreation/>
            }
            {
                locState instanceof DraftRequest &&
                <RequestSubmission request={ locState }/>
            }
            {
                locState !== undefined && !(locState instanceof DraftRequest) &&
                <RequestStatus request={ locState }/>
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
