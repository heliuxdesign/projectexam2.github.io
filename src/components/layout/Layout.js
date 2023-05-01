import { Navbar, Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    NavLink,
  } from 'react-router-dom';
import { clearStorage } from '../Storage.js';
import logo from '../../images/logo.png';


function Navigation() {

  const onClickHandler = () => {
    clearStorage();
  };

  return (
  <>
  <Navbar bg="light" expand="lg" className="some-navbar">
    <Container>
      <NavLink classNmae="navbar-logo" to="/home" exact>
        <Navbar.Brand><img src={logo} alt="Some logo" className="nav-logo" /></Navbar.Brand>
      </NavLink>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <NavLink to="/home" className="nav-link">Home</NavLink>
          <NavLink to="/posts" className="nav-link">Posts</NavLink>
          <NavLink to="/profiles" className="nav-link">Profiles</NavLink>
          <NavLink to="/" className="nav-link" onClick={onClickHandler}>Log out</NavLink>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  </>
  );
}
export default Navigation;