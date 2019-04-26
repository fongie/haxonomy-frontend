import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {auth} from '../components/Auth';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
/*
import './Header.css';
*/

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


    handleSelect = (eventKey) => {
/*
        alert(`selected ${eventKey}`);
*/
        this.setState({selectedKey: eventKey.valueOf()})
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" className="mr-auto" activeKey={this.state.selectedKey} onSelect={k => this.handleSelect(k)}>
                        <Nav.Link eventKey="1" href="/home">Home</Nav.Link>
                        <Nav.Link eventKey="2" href="/haxonomy">Haxonomy</Nav.Link>
                        <Nav.Link eventKey="3" href="/administrate">Administrate</Nav.Link>
                        <Nav.Link eventKey="4" href="/tool">Tool</Nav.Link>
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
