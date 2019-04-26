import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {Row, Col} from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

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
            <div>
                <Row>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Action</Card.Title>
                                <Card.Text>
                                    Describes a term that the user should look for...
                                </Card.Text>
                                <Button variant="primary">YES</Button>
                                <Button variant="primary">NO</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Header>Featured</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default Tool;
