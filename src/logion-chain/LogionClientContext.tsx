import config from '../config/index';
import { LogionClient, DefaultSignAndSendStrategy, SponsorshipState, BackendConfig } from "@logion/client";
import { enableMetaMask, allMetamaskAccounts, ExtensionSigner } from "@logion/extension";
import { UUID } from "@logion/node-api";
import { Context, createContext, ReactNode, useState, useEffect, useContext, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PARAM_IDENFY_RESULT } from 'src/Paths';

interface StaticState {
    client: LogionClient | null;
    sponsorshipId: UUID | null;
    idenfyResult: string | null;
}

export interface DynamicState {
    sponsorshipState: SponsorshipState | null;
    errorMessage: string | null;
    backendConfig: BackendConfig | null;
    refresh: () => Promise<void>;
}

export interface LogionClientContextType extends StaticState, DynamicState {
}

const INITIAL_STATIC_STATE: StaticState = {
    client: null,
    sponsorshipId: null,
    idenfyResult: null,
}

const INITIAL_DYNAMIC_STATE: DynamicState = {
    sponsorshipState: null,
    errorMessage: null,
    backendConfig: null,
    refresh: () => Promise.reject(),
}

const LogionClientContext: Context<LogionClientContextType> = createContext<LogionClientContextType>({
    ...INITIAL_STATIC_STATE,
    ...INITIAL_DYNAMIC_STATE,
});

export interface Props {
    children: ReactNode;
}

export default function LogionClientContextProvider(props: Props) {
    const [ staticState, setStaticState ] = useState<StaticState>(INITIAL_STATIC_STATE);
    const [ staticStateInitializing, setStaticStateInitializing ] = useState(false);
    const [ dynamicState, setDynamicState ] = useState<DynamicState>(INITIAL_DYNAMIC_STATE);
    const [ dynamicStateInitializing, setDynamicStateInitializing ] = useState(false);
    const [ searchParams ] = useSearchParams();

    const sponsorshipIdParam = useParams<"sponsorshipId">().sponsorshipId;
    const idenfyResult = searchParams.get(PARAM_IDENFY_RESULT);

    const refresh = useCallback(async (currentSponsorshipState: SponsorshipState) => {
        const newSponsorshipState = await currentSponsorshipState.refresh();
        const backendConfig = await newSponsorshipState.legalOfficer.getConfig();
        setDynamicState({
            errorMessage: null,
            sponsorshipState: newSponsorshipState,
            backendConfig,
            refresh: () => refresh(newSponsorshipState)
        });
    }, []);

    useEffect(() => {
        if (staticState.client === null && dynamicState.errorMessage === null && !staticStateInitializing) {
            setStaticStateInitializing(true);
            (async function () {
                let errorMessage = "";
                try {
                    const sponsorshipId = sponsorshipIdParam ? UUID.fromAnyString(sponsorshipIdParam) : undefined;
                    if (sponsorshipId !== undefined) {
                        const client = await connectToLogionWithMetamask();
                        setStaticState({
                            client,
                            sponsorshipId,
                            idenfyResult,
                        })
                    } else {
                        errorMessage = `Unable to detect a valid Sponsorship ID: ${ sponsorshipIdParam }`;
                    }
                } catch (e: any) {
                    if ("message" in e) {
                        errorMessage = e.message;
                    } else {
                        errorMessage = "" + e;
                    }
                } finally {
                    if (errorMessage.length > 0) {
                        setDynamicState({
                            ...dynamicState,
                            errorMessage,
                        })
                    }
                }
            })();
        }
    }, [ staticState, dynamicState, refresh, sponsorshipIdParam, idenfyResult, staticStateInitializing ]);

    useEffect(() => {
        if (dynamicState.sponsorshipState === null && dynamicState.errorMessage === null && staticState.client !== null && staticState.sponsorshipId !== null && !dynamicStateInitializing) {
            setDynamicStateInitializing(true);
            (async function () {
                let errorMessage = "";
                try {
                    const sponsorshipState = await staticState.client!.sponsorshipState(staticState.sponsorshipId!);
                    const backendConfig = await sponsorshipState.legalOfficer.getConfig();
                    setDynamicState({
                        errorMessage: null,
                        sponsorshipState,
                        backendConfig,
                        refresh: () => refresh(sponsorshipState)
                    })
                } catch (e: any) {
                    errorMessage = "" + e;
                } finally {
                    if (errorMessage.length > 0) {
                        setDynamicState({
                            ...dynamicState,
                            errorMessage,
                        })
                    }
                }
            })();
        }
    }, [ staticState, dynamicState, refresh, sponsorshipIdParam, dynamicStateInitializing ]);

    return (
        <LogionClientContext.Provider value={ {
            ...staticState,
            ...dynamicState,
        } }>
            { props.children }
        </LogionClientContext.Provider>
    )
}

const SIGN_AND_SEND_STRATEGY = new DefaultSignAndSendStrategy();

function getEndpoints(): string[] {
    const providerSocket = config.PROVIDER_SOCKET;
    if (providerSocket !== undefined) {
        return [ providerSocket ];
    } else {
        return config.edgeNodes.map(node => node.socket);
    }
}

async function connectToLogionWithMetamask(): Promise<LogionClient> {

    const anonymousClient = await LogionClient.create({
        rpcEndpoints: getEndpoints(),
        directoryEndpoint: config.directory
    });
    const metaMaskEnabled = await enableMetaMask(config.APP_NAME);
    if (metaMaskEnabled) {
        const metamaskAccounts = await allMetamaskAccounts();
        const validAccounts = metamaskAccounts.map(account =>
            anonymousClient.logionApi.adapters.getValidAccountId(account.address, "Ethereum")
        );
        return await anonymousClient.authenticate(validAccounts, new ExtensionSigner(SIGN_AND_SEND_STRATEGY))
    } else {
        throw Error("Failed to enable Metamask")
    }
}

export function useLogionClientContext() {
    return useContext(LogionClientContext);
}
