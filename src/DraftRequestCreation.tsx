import { ChangeEvent, useCallback, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Centered from "./Centered";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import RequestFormField, { RequestFormData } from "./RequestFormFields";

export default function DraftRequestCreation() {
    const { control, handleSubmit, formState: { errors } } = useForm<RequestFormData>({
        values: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            city: "",
            country: "",
            zip: "",
        }
    });
    const [ process, setProcess ] = useState<File>();
    const [ processError, setProcessError ] = useState<string>();
    const [ proof, setProof ] = useState<File>();
    const [ proofError, setProofError ] = useState<string>();
    const { client } = useLogionClientContext();

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
            (async function() {
                const locs = await client.locsState();
                await locs.requestIdentityLoc({
                    description: "",
                    legalOfficer: client.legalOfficers[0], // TODO comes from sponsorship
                    draft: true,
                    sponsorshipId: undefined, // TODO comes from URL
                    template: "individual_identity",
                    userIdentity: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                    }
                });
                // TODO refresh state
            })();
        }
    }, [ process, proof, client, validateFiles ]);

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
                                <Button type="submit">Create draft LOC request</Button>
                            </Centered>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
