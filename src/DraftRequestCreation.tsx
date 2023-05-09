import { DraftRequest, HashOrContent } from "@logion/client";
import { ChangeEvent, useCallback, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Centered from "./Centered";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import RequestFormField, { RequestFormData } from "./RequestFormFields";
import { PROCESS_FILE_NATURE, TEMPLATE_ID, PROOF_FILE_NATURE } from "./Template";

export default function DraftRequestCreation() {
    const { control, handleSubmit, formState: { errors } } = useForm<RequestFormData>({
        values: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            line1: "",
            line2: "",
            city: "",
            country: "",
            postalCode: "",
        }
    });
    const [ process, setProcess ] = useState<File>();
    const [ processError, setProcessError ] = useState<string>();
    const [ proof, setProof ] = useState<File>();
    const [ proofError, setProofError ] = useState<string>();
    const { client, sponsorshipState, sponsorshipId, refresh } = useLogionClientContext();
    const [ creating, setCreating ] = useState(false);

    const validateFiles = useCallback(() => {
        if(!process) {
            setProcessError("This file is required");
        }
        if(!proof) {
            setProofError("This file is required");
        }
    }, [ process, proof ]);

    const createDraftRequest = useCallback((formData: RequestFormData) => {
        validateFiles();

        if(process && proof && client) {
            setCreating(true);
            (async function() {
                if (sponsorshipState === null || sponsorshipId === null) {
                    return
                }
                const locs = await client.locsState();
                const draftLoc = await locs.requestIdentityLoc({
                    description: `KYC ${ formData.firstName } ${ formData.lastName } - ${ client.currentAddress?.toKey() }`,
                    legalOfficer: sponsorshipState.legalOfficer,
                    draft: true,
                    sponsorshipId: sponsorshipId,
                    template: TEMPLATE_ID,
                    userIdentity: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                    },
                    userPostalAddress: {
                        line1: formData.line1,
                        line2: formData.line2,
                        postalCode: formData.postalCode,
                        city: formData.city,
                        country: formData.country,
                    }
                }) as DraftRequest;
                const draftLocWithFirstFile = await draftLoc.addFile({
                    file: await HashOrContent.fromContentFinalized(process),
                    fileName: process.name,
                    nature: PROCESS_FILE_NATURE,
                });
                await draftLocWithFirstFile.addFile({
                    file: await HashOrContent.fromContentFinalized(proof),
                    fileName: proof.name,
                    nature: PROOF_FILE_NATURE,
                });

                await refresh();
                setCreating(false);
            })();
        }
    }, [ process, proof, client, validateFiles, sponsorshipId, sponsorshipState, refresh ]);

    const handleInvalidForm = useCallback(() => {
        validateFiles();
    }, [ validateFiles ]);

    const handleProcess = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) {
            return
        }
        setProcess(e.target.files[0]);
        setProcessError(undefined);
    }

    const handleProof = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) {
            return
        }
        setProof(e.target.files[0]);
        setProofError(undefined);
    }

    return (
        <div className="DraftRequestCreation">
            <Form
                onSubmit={handleSubmit(createDraftRequest, handleInvalidForm)}
            >
                <RequestFormField
                    control={ control }
                    errors={ errors }
                    handleProcess={ handleProcess }
                    handleProof={ handleProof }
                    processError={ processError }
                    proofError={ proofError }
                />
                <Row>
                    <Col>
                        <div className="button-area">
                            <Centered>
                            {
                                    creating &&
                                    <Spinner/>
                                }
                                {
                                    !creating &&
                                    <Button type="submit">Create draft LOC request</Button>
                                }
                            </Centered>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
