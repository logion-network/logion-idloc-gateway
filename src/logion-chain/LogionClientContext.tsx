import config from '../config/index';
import { LogionClient, DefaultSignAndSendStrategy } from "@logion/client";
import { enableMetaMask, allMetamaskAccounts, ExtensionSigner } from "@logion/extension";
import { AnyAccountId } from "@logion/node-api";
import { Context, createContext, ReactNode, useState, useEffect, useContext } from "react";

export interface LogionClientContextType {
    client: LogionClient | null
}

const INITIAL_STATE: LogionClientContextType = {
    client: null
}
const LogionClientContext: Context<LogionClientContextType> = createContext<LogionClientContextType>(INITIAL_STATE);

export interface Props {
    children: ReactNode;
}

export default function LogionClientContextProvider(props: Props) {
    const [ state, setState ] = useState<LogionClientContextType>(INITIAL_STATE);

    useEffect(() => {
        if (state.client === null) {
            connectToLogionWithMetamask().then(client => setState({
                client
            }))
        }
    }, [ state.client ]);

    return (
        <LogionClientContext.Provider value={ state }>
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
        const validAccounts = metamaskAccounts.map(account => new AnyAccountId(
            anonymousClient.nodeApi,
            account.address,
            "Ethereum",
        ).toValidAccountId());
        return await anonymousClient.authenticate(validAccounts, new ExtensionSigner(SIGN_AND_SEND_STRATEGY))
    } else {
        throw Error("Failed to enable Metamask")
    }
}

export function useLogionClientContext() {
    return useContext(LogionClientContext);
}
