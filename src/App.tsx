import LogionClientContextProvider from "./logion-chain/LogionClientContext";
import Header from "./Header";

export default function App() {
    return (
        <LogionClientContextProvider>
            <Header/>
        </LogionClientContextProvider>
    )
}
