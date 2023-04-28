import Logo from "./Logo";
import { Row, Col } from "react-bootstrap";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import "./Header.css";
import LegalOfficer from "./LegalOfficer";
import YourAddress from "./YourAddress";
import Sponsor from "./Sponsor";

export default function Header() {
    const { client } = useLogionClientContext();

    return (
        <Row className="Header">
            <Col md={3}>
                <Logo size={ 120 } />
            </Col>
            <Col>
                <Row>
                    <Col>
                        <LegalOfficer/>
                    </Col>
                    { client?.currentAddress?.address !== undefined &&
                        <Col>
                            <YourAddress/>
                        </Col>
                    }
                </Row>
                <Row>
                    <Col>
                        <Sponsor/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
