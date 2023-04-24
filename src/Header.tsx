import Logo from "./Logo";
import { Row, Col } from "react-bootstrap";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";
import "./Header.css";
import LegalOfficer from "./LegalOfficer";
import YourAddress from "./YourAddress";
import Marketplace from "./Marketplace";

export default function Header() {
    const { client } = useLogionClientContext();

    return (
        <Row className="Header">
            <Col md={3}>
                <Logo size={ 170 } />
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
                        <Marketplace/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
