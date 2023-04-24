import { ChangeEvent, useCallback, useState } from "react";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import "./DraftRequestCreation.css";
import Centered from "./Centered";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";

interface FormData {
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    email: string;
    phoneNumber: string;
}

export default function DraftRequestCreation() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
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

    const createDraftRequest = useCallback((formData: FormData) => {
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
                <Row>
                    <Col>
                        <FormField
                            fieldName="firstName"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="First name"
                                    { ...field }
                                />
                            )}
                            requiredMessage="First name is required"
                        />
                    </Col>
                    <Col>
                        <FormField
                            fieldName="lastName"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="Last name"
                                    { ...field }
                                />
                            )}
                            requiredMessage="Last name is required"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormField
                            fieldName="email"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="E-mail"
                                    { ...field }
                                />
                            )}
                            requiredMessage="E-mail is required"
                        />
                    </Col>
                    <Col>
                        <FormField
                            fieldName="phoneNumber"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="Phone number"
                                    { ...field }
                                />
                            )}
                            requiredMessage="Phone number is required"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormField
                            fieldName="address"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="Address"
                                    { ...field }
                                />
                            )}
                            requiredMessage="Address is required"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormField
                            fieldName="zip"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="ZIP"
                                    { ...field }
                                />
                            )}
                            requiredMessage="ZIP is required"
                        />
                    </Col>
                    <Col>
                        <FormField
                            fieldName="city"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="City"
                                    { ...field }
                                />
                            )}
                            requiredMessage="City is required"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormField
                            fieldName="country"
                            control={ control }
                            errors={ errors }
                            render={ field => (
                                <FormControl
                                    placeholder="Country"
                                    { ...field }
                                />
                            )}
                            requiredMessage="Country is required"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup
                            className="file-selector"
                        >
                            <FormControl
                                type="file"
                                onChange={ handleProcess }
                                accept="application/pdf"
                                isInvalid={ processError !== undefined }
                            />
                            <Form.Control.Feedback
                                id="process-feedback"
                                type="invalid"
                            >
                                { processError }
                            </Form.Control.Feedback>
                            <FormLabel>Identity LOC process and related obligations signed by the Requester</FormLabel>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup
                            className="file-selector"
                        >
                            <FormControl
                                type="file"
                                onChange={ handleProof }
                                accept="application/pdf"
                                isInvalid={ proofError !== undefined }
                            />
                            <Form.Control.Feedback
                                id="proof-feedback"
                                type="invalid"
                            >
                                { proofError }
                            </Form.Control.Feedback>
                            <FormLabel>Proof of identity</FormLabel>
                        </FormGroup>
                    </Col>
                </Row>
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
