export interface Node {
    socket: string;
    peerId: string;
}

export interface ConfigType {
    APP_NAME: string,
    DEVELOPMENT_KEYRING: boolean,
    PROVIDER_SOCKET?: string,
    RPC: object,
    directory: string,
    edgeNodes: Node[],
}

export const DEFAULT_CONFIG: ConfigType = {
    APP_NAME: "Logion Identity LOC Gateway",
    DEVELOPMENT_KEYRING: true,
    RPC: {
    },
    directory: "",
    edgeNodes: [],
};

export interface EnvConfigType extends Record<string, any> {

}

const configEnv: EnvConfigType = require(`./${process.env.NODE_ENV}.json`);

const envVarNames: string[] = [
    'REACT_APP_PROVIDER_SOCKET',
    'REACT_APP_DEVELOPMENT_KEYRING'
];
const envVars: EnvConfigType = envVarNames.reduce<EnvConfigType>((mem, n) => {
    if (process.env[n] !== undefined) {
        const configFieldName = n.slice(10);
        mem[configFieldName] = process.env[n];
    }
    return mem;
}, {});

// TODO Check why CONFIG is not resolved.
// declare var CONFIG: any;
// const config: ConfigType = { ...DEFAULT_CONFIG, ...configEnv, ...envVars, ...CONFIG };
const config: ConfigType = { ...DEFAULT_CONFIG, ...configEnv, ...envVars };
export default config;
