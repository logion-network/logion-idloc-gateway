import { DraftRequest } from "@logion/client";
import { UUID } from "@logion/node-api";
import { useCallback } from "react";
import { resumeAfterIDenfyProcessUrl } from "./Paths";

export function useSubmitCallback(request: DraftRequest, refresh: () => Promise<void>) {
    return useCallback(async () => {
        await request.submit();
        await refresh();
    }, [ request, refresh ]);
}

export function useCancelCallback(request: DraftRequest, refresh: () => Promise<void>) {
    return  useCallback(async () => {
        await request.cancel();
        await refresh();
    }, [ request, refresh ]);
}

export function useStartIdAmlCheckCallback(request: DraftRequest, sponsorshipId: UUID | null) {
    return useCallback(async () => {
        if(sponsorshipId) {
            const newState = await request.startNewIDenfySession({
                successUrl: resumeAfterIDenfyProcessUrl("success", sponsorshipId),
                errorUrl: resumeAfterIDenfyProcessUrl("error", sponsorshipId),
                unverifiedUrl: resumeAfterIDenfyProcessUrl("unverified", sponsorshipId),
            });
            window.location.href = newState.iDenfySessionUrl;
        }
    }, [ request, sponsorshipId ]);
}
