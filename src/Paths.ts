import { UUID } from "@logion/node-api";

export function resumeAfterIDenfyProcessUrl(result: 'success' | 'error' | 'unverified', sponsorshipId: UUID): string {
    return `${ getBaseUrl(sponsorshipId) }?${ PARAM_IDENFY_RESULT }=${ result }`;
}

export const PARAM_IDENFY_RESULT = "idenfy_result";

export function getBaseUrl(sponsorshipId: UUID): string {
    return `${ window.location.protocol }//${ window.location.host }/${ RELATIVE_PATH }/${ sponsorshipId.toDecimalString() }`;
}

export const RELATIVE_PATH = "sponsorship";
