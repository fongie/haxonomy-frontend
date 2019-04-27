import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {auth} from '../components/Auth';
import './Header.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

/**
 * Presents the user with a navigation bar to navigate the various pages of the web app.
 */
class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedKey: ""
        }
    }


    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" className="mr-auto">
                        <Nav.Link eventKey="1"><Link class="nav-link" to ='/home' >Home</Link></Nav.Link>
                        <Nav.Link eventKey="2"><Link class="nav-link" to ='/haxonomy' >Haxonomy</Link></Nav.Link>
                        <Nav.Link eventKey="3"><Link class="nav-link" to ='/administrate' >Administrate</Link></Nav.Link>
                        <Nav.Link eventKey="4"><Link class="nav-link" to ='/tool' >Tool</Link></Nav.Link>
                    </Nav>
                    <AuthButton/>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

/**
 * Presents the user with a log in button if the user is not logged in and a log out button with username if the user is
 * logged in.
 * @type {React.ComponentType<Own>}
 */
const AuthButton = withRouter(({ history }) => (
    auth.isAuthenticated ? (
        <Button variant="outline-success" id="headerButton"
                    onClick={() => {
                auth.signout(() => history.push('/login'))
            }}>sign out {auth.user}</Button>
    ) : (
        <Button variant="outline-success" id="headerButton"
                onClick={() => {
                    history.replace('/login');
                }}>log in</Button>
    )
))

export default withRouter(Header);
