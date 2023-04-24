import LogionClientContextProvider from "./logion-chain/LogionClientContext";
import Root from "./Root";

export default function App() {
    return (
        <LogionClientContextProvider>
            <Root/>
        </LogionClientContextProvider>
    )
}
