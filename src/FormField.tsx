import { Form, FormGroup } from "react-bootstrap";
import { Control, Controller, FieldErrors, FieldPath, FieldValues, Path, ControllerRenderProps } from "react-hook-form";
import "./FormField.css";

export interface Props<F extends FieldValues> {
    fieldName: Path<F>;
    control: Control<F>;
    errors: FieldErrors<F>;
    render: (field: ControllerRenderProps<F, FieldPath<F>> & { isInvalid: boolean, id: string }) => React.ReactElement;
    requiredMessage: string;
    disabled?: boolean;
}

export default function FormField<F extends FieldValues>(props: Props<F>) {
    const feedback = props.errors[props.fieldName]?.message;

    return (
        <FormGroup
            className="FormField"
        >
            <Controller
                name={ props.fieldName }
                control={ props.control }
                rules={ { required: props.requiredMessage } }
                render={ ({ field }) => props.render({
                    ...field,
                    isInvalid: feedback !== undefined,
                    id: `${ props.fieldName }-feedback`,
                }) }
            />
            <Form.Control.Feedback
                id={ `${ props.fieldName }-feedback`  }
                type="invalid"
            >
                { isString(feedback) ? feedback : "" }
            </Form.Control.Feedback>
        </FormGroup>
    );
}

function isString(x: any): x is string {
    return typeof x === "string";
}
