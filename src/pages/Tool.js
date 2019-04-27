import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {Row, Col} from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import CardColumns from 'react-bootstrap/CardColumns'
import CardDeck from 'react-bootstrap/CardDeck'
import ProgressBar from 'react-bootstrap/ProgressBar'

/**
 * UI for the tool that guides the user through the search for web vulnerabilities
 */
class Tool extends Component{

    constructor(props){
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <CardDeck>
                <Card style={{width: '45vw'}}>
                    <Card.Body>
                        <Card.Title>Next action</Card.Title>
                        <Card.Text>
                            Does the site have HTTPS
                        </Card.Text>
                        <Button variant="primary" style={{margin:'0.5em'}}>YES</Button>
                        <Button variant="primary">NO</Button>
                    </Card.Body>
                </Card>
                <Card style={{width: '18rem'}}>
                    <Card.Header>Reports</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>First report</ListGroup.Item>
                        <ListGroup.Item>Second report</ListGroup.Item>
                        <ListGroup.Item>Third report</ListGroup.Item>
                    </ListGroup>
                </Card>
                <Card>
                    <p>Injection</p>
                    <ProgressBar striped variant="success" now={40}/>
                    <p>Broken Authentication</p>
                    <ProgressBar striped variant="info" now={20}/>
                    <p>Sensitive Data Exposure</p>
                    <ProgressBar striped variant="warning" now={60}/>
                    <p>XML External Entities</p>
                    <ProgressBar striped variant="danger" now={80}/>
                </Card>
            </CardDeck>
        )
    }

}

export default Tool;
