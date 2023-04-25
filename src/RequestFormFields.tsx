import { ChangeEvent } from "react";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { Control, FieldErrors } from "react-hook-form";
import FormField from "./FormField";
import "./RequestFormField.css";
import { PROCESS_FILE_NATURE, PROOF_FILE_NATURE } from "./Template";

export interface RequestFormData {
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    email: string;
    phoneNumber: string;
}

export interface Props {
    control: Control<RequestFormData>;
    errors: FieldErrors<RequestFormData>;
    handleProcess: (event: ChangeEvent<HTMLInputElement>) => void;
    processError?: string;
    handleProof: (event: ChangeEvent<HTMLInputElement>) => void;
    proofError?: string;
    disabled?: boolean;
    downloadProcess?: () => void;
    downloadProof?: () => void;
}

export default function RequestFormField(props: Props) {

    return (
        <div className="RequestFormField">
            <Row>
                <Col>
                    <FormField
                        fieldName="firstName"
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="First name"
                                disabled={ props.disabled }
                                { ...field }
                            />
                        )}
                        requiredMessage="First name is required"
                        disabled={ props.disabled }
                    />
                </Col>
                <Col>
                    <FormField
                        fieldName="lastName"
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="Last name"
                                disabled={ props.disabled }
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
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="E-mail"
                                disabled={ props.disabled }
                                { ...field }
                            />
                        )}
                        requiredMessage="E-mail is required"
                    />
                </Col>
                <Col>
                    <FormField
                        fieldName="phoneNumber"
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="Phone number"
                                disabled={ props.disabled }
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
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="Address"
                                disabled={ props.disabled }
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
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="ZIP"
                                disabled={ props.disabled }
                                { ...field }
                            />
                        )}
                        requiredMessage="ZIP is required"
                    />
                </Col>
                <Col>
                    <FormField
                        fieldName="city"
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="City"
                                disabled={ props.disabled }
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
                        control={ props.control }
                        errors={ props.errors }
                        render={ field => (
                            <FormControl
                                placeholder="Country"
                                disabled={ props.disabled }
                                { ...field }
                            />
                        )}
                        requiredMessage="Country is required"
                    />
                </Col>
            </Row>
            {
                !props.disabled &&
                <>
                    <Row>
                        <Col>
                            <FormGroup
                                className="file-selector"
                            >
                                <FormControl
                                    type="file"
                                    onChange={ props.handleProcess }
                                    accept="application/pdf"
                                    isInvalid={ props.processError !== undefined }
                                />
                                <Form.Control.Feedback
                                    id="process-feedback"
                                    type="invalid"
                                >
                                    { props.processError }
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
                                    onChange={ props.handleProof }
                                    accept="application/pdf"
                                    isInvalid={ props.proofError !== undefined }
                                />
                                <Form.Control.Feedback
                                    id="proof-feedback"
                                    type="invalid"
                                >
                                    { props.proofError }
                                </Form.Control.Feedback>
                                <FormLabel>Proof of identity</FormLabel>
                            </FormGroup>
                        </Col>
                    </Row>
                </>
            }
            {
                props.disabled &&
                <Row>
                    <Col>
                        <Button
                            variant="link"
                            onClick={ props.downloadProcess }
                        >
                            { PROCESS_FILE_NATURE }
                        </Button><br/>
                        <Button
                            variant="link"
                            onClick={ props.downloadProof }
                        >
                            { PROOF_FILE_NATURE }
                        </Button>
                    </Col>
                </Row>
            }
        </div>
    );
}
