import config from '../config/index';
import { LogionClient, DefaultSignAndSendStrategy, SponsorshipState } from "@logion/client";
import { enableMetaMask, allMetamaskAccounts, ExtensionSigner } from "@logion/extension";
import { UUID } from "@logion/node-api";
import { Context, createContext, ReactNode, useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";

interface StaticState {
    client: LogionClient | null;
    sponsorshipId: UUID | null;
}

export interface DynamicState {
    sponsorshipState: SponsorshipState | null;
    errorMessage: string | null;
    refresh: () => Promise<void>;
}

export interface LogionClientContextType extends StaticState, DynamicState {
}

const INITIAL_STATIC_STATE: StaticState = {
    client: null,
    sponsorshipId: null,
}

const INITIAL_DYNAMIC_STATE: DynamicState = {
    sponsorshipState: null,
    errorMessage: null,
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
    const [ dynamicState, setDynamicState ] = useState<DynamicState>(INITIAL_DYNAMIC_STATE);

    const sponsorshipIdParam = useParams<"sponsorshipId">().sponsorshipId;

    const refresh = useCallback(async (currentSponsorshipState: SponsorshipState) => {
        const newSponsorshipState = await currentSponsorshipState.refresh();
        setDynamicState({
            errorMessage: null,
            sponsorshipState: newSponsorshipState,
            refresh: () => refresh(newSponsorshipState)
        })
    }, [])

    useEffect(() => {
        if (staticState.client === null && dynamicState.errorMessage === null) {
            (async function () {
                    let errorMessage = "";
                    try {
                        const sponsorshipId = sponsorshipIdParam ? UUID.fromAnyString(sponsorshipIdParam) : undefined;
                        if (sponsorshipId !== undefined) {
                            const client = await connectToLogionWithMetamask();
                            setStaticState({
                                client,
                                sponsorshipId,
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
                }
            )()
        }
    }, [ staticState, dynamicState, refresh, sponsorshipIdParam ]);

    useEffect(() => {
        if (dynamicState.sponsorshipState === null && dynamicState.errorMessage === null && staticState.client !== null && staticState.sponsorshipId !== null) {
            (async function () {
                    let errorMessage = "";
                    try {
                        const sponsorshipState = await staticState.client!.sponsorshipState(staticState.sponsorshipId!);
                        setDynamicState({
                            errorMessage: null,
                            sponsorshipState,
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
                }
            )()
        }
    }, [ staticState, dynamicState, refresh, sponsorshipIdParam ]);

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
