import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ButtonBar from "./ButtonBar";
import RequestFormField, { RequestFormData } from "./RequestFormFields";
import "./RequestSubmission.css";

export default function RequestSubmission() {
    const { control, formState: { errors }, setValue } = useForm<RequestFormData>({
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

    useEffect(() => {// TODO take values from request
        setValue("firstName", "John");
        setValue("lastName", "Doe");
        setValue("email", "john@doe.com");
        setValue("phoneNumber", "+1234");
        setValue("address", "?");
        setValue("city", "?");
        setValue("country", "?");
        setValue("zip", "?");
    }, [ setValue ]);

    return (
        <div className="RequestSubmission">
            <h2>Identity LOC request</h2>

            <RequestFormField
                control={ control }
                errors={ errors }
                handleProcess={ () => {} }
                handleProof={ () => {} }
                disabled={ true }
            />

            <ButtonBar>
                <Button variant="danger"> { /* TODO onClick cancel draft request using state */ }
                    Cancel request
                </Button>
                <Button> { /* TODO onClick submit draft request using state */ }
                    Submit request
                </Button>
            </ButtonBar>
        </div>
    );
}
