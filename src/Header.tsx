import Logo from "./Logo";
import { Row, Col } from "react-bootstrap";
import { useLogionClientContext } from "./logion-chain/LogionClientContext";


export default function Header() {

    const { client } = useLogionClientContext();

    return (
        <Row>
            <Col>
                <Logo size={ 200 } />
            </Col>
            <Info userAddress={ client?.currentAddress?.address } />
        </Row>
    )
}

interface Props {
    userAddress: string | undefined;
}

function Info(props: Props) {
    const { userAddress } = props;
    return (
        <>
            <Col>
                <p>Your Legal Officer: Alice (alice@logion.network)</p>
                <p>Marketplace ID: nnn</p>
            </Col>
            { userAddress !== undefined &&
                <Col>
                    <p>Your address: { userAddress }</p>
                </Col>
            }
        </>
    )
}

