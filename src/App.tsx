import LogionClientContextProvider from "./logion-chain/LogionClientContext";
import { RELATIVE_PATH } from "./Paths";
import Root from "./Root";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path={ RELATIVE_PATH }>
                    <Route path=":sponsorshipId" element={ <Main /> } />
                </Route>
            </Routes>
        </Router>
    )
}

function Main() {
    return (
        <LogionClientContextProvider>
            <Root />
        </LogionClientContextProvider>
    )
}
