import { DraftRequest, TypedFile } from "@logion/client";
import { useCallback } from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ButtonBar from "./ButtonBar";
import RequestFormField, { RequestFormData } from "./RequestFormFields";
import { PROCESS_FILE_NATURE, PROOF_FILE_NATURE } from "./Template";
import "./RequestSubmission.css";

export interface Props {
    request: DraftRequest;
}

export default function RequestSubmission(props: Props) {
    const { control, formState: { errors } } = useForm<RequestFormData>({
        values: {
            firstName: props.request.data().userIdentity?.firstName || "",
            lastName: props.request.data().userIdentity?.lastName || "",
            email: props.request.data().userIdentity?.email || "",
            phoneNumber: props.request.data().userIdentity?.phoneNumber || "",
            line1: props.request.data().userPostalAddress?.line1 || "",
            line2: props.request.data().userPostalAddress?.line2 || "",
            city: props.request.data().userPostalAddress?.city || "",
            country: props.request.data().userPostalAddress?.country || "",
            postalCode: props.request.data().userPostalAddress?.postalCode || "",
        }
    });

    const downloadFileByNature = useCallback(async (nature: string) => {
        const locFile = props.request.data().files.find(file => file.nature === nature);
        if(!locFile) {
            throw new Error("No file with given nature");
        } else {
            const typedFile = await props.request.getFile(locFile.hash);
            openFile(locFile.name, typedFile);
        }
    }, [ props.request ]);

    const downloadProcess = useCallback(async () => {
        await downloadFileByNature(PROCESS_FILE_NATURE);
    }, [ downloadFileByNature ]);

    const downloadProof = useCallback(async () => {
        await downloadFileByNature(PROOF_FILE_NATURE);
    }, [ downloadFileByNature ]);

    return (
        <div className="RequestSubmission">
            <h2>Identity LOC request</h2>

            <RequestFormField
                control={ control }
                errors={ errors }
                handleProcess={ () => {} }
                handleProof={ () => {} }
                disabled={ true }
                downloadProcess={ downloadProcess }
                downloadProof={ downloadProof }
            />

            <ButtonBar>
                <Button
                    variant="danger"
                    onClick={ () => props.request.cancel() }
                >
                    Cancel request
                </Button>
                <Button
                    onClick={ () => props.request.submit() }
                >
                    Submit request
                </Button>
            </ButtonBar>
        </div>
    );
}

async function openFile(fileName: string, file: TypedFile) {
    const url = window.URL.createObjectURL(new Blob([ file.data ]));
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.target = "_blank"
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
}
