import Register from '../register/Register';
import Login from '../login/Login';
import { Container, Row, Col } from 'react-bootstrap';
import logo from '../../images/logo.png';

export default function LandingPage() {
    return (
        <>
            <Container className="layout-container">
                <Row>
                    <Col xs={12} md={6} className="centered">
                        <img src={logo} alt="Some logo" className="img-logo"/>
                        <h1>SOME - and you can contact the whole world </h1>
                        <p>Create your own profile and you can make posts on topics of your choice!</p>
                    </Col>
                    <Col xs={12} md={6}>
                        <Login />
                        <Register />
                    </Col>
                </Row>
            </Container>
        </>
    );   
  }