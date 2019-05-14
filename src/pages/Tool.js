import React, {Component} from 'react';
import './Tool.css';
import {server, replies, markovaction, tool, next, init} from '../config';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import CardDeck from 'react-bootstrap/CardDeck'
import ProgressBar from 'react-bootstrap/ProgressBar'


/**
 * Actions
 * @type {string}
 */
const unknown = "UNKNOWN";
const yes = "YES";
const no = "NO";

/**
 * UI for the tool that guides the user through the search for web vulnerabilities
 */
class Tool extends Component{

    constructor(props) {
        super(props);

        this.state = {
            data: undefined,
            numberOfActions: 0,
            actionStatus: unknown, // must be YES or NO before sending to backend
            markovStateId: 1
        }
    }

    componentDidMount(){
        //TODO POST a request http://localhost:8080/tool/init
/*
        this.initiateState();
*/
        this.fetchNextAction();
    }

    initiateState = () => {
        fetch(server + init, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if(response.error) throw new Error("Something went wrong, please try again in a few minutes");
            else return response;
        }).catch((e) => {
            alert(e.message);
        });
    };

    /**
     * GETs the next action in a specified markov state (right now hardcoded to state 1)
     */
    fetchNextAction = () => {
        fetch(server + tool + "/" + this.state.markovStateId + next,
            {credentials: 'include'}
        ).then(res => res.json())
            .then((response) => {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(res => {
                this.setState({data: res})
            })
            .catch(e => {
                alert(e.message);
            });

        this.setState({numberOfActions: this.state.numberOfActions + 1}) // update number of actions
    };

    /**
     * Updates answer to YES or NO, then calls the server via sendActionAnswerToServer, because of async
     * @param answer
     */
    handleActionAnswer = (answer) => {
        this.setState({actionStatus: answer},
            this.sendActionAnswerToServer);
    };

    sendActionAnswerToServer = () => {
        if(this.state.actionStatus !== unknown){
            let jsonRequest = {};

            //check if the answer from the user, actionStatus === the Reply (YES or NO) that we got from the server when answering this question
            if (this.state.actionStatus === this.state.data.reply.name){
                jsonRequest = {
                    "reply": server + tool + "/" + this.state.markovStateId + "/" + next
                }
            } else {
                jsonRequest = {
                    "reply": server + replies + "/" + this.state.actionStatus
                }
            }

            fetch(server + markovaction + "/" + this.state.data.id, {
                credentials: 'include',
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonRequest),
            }).then((response) => {
                return response.json();
            }).then((response) => {
                if(response.error) throw new Error("Something went wrong, please try again in a few minutes");
                else return response;
            }).catch((e) => {
                alert(e.message);
            });

            this.fetchNextAction(); // fetch next action
        }
    };

    /**
     * Extracts reports that matches the current action
     */
    getReportsMatchingCurrentAction(){
       /* for (let key in this.state.data.term.broaderTerm){
            console.log('name = ' + key + ' reports = ' + this.state.data.term.broaderTerm.reports[key])
        }*/
    }

    render() {
        return (
            <CardDeck>
                <Card style={{width: '45vw'}}>
                    <Card.Body>
                        <Card.Title>
                            Next Action
                        </Card.Title>
                        <Card.Text>
                            {(this.state.data) ? "Does the site have '" + this.state.data.term.name + "'" : <p>LOADING..</p>}
                        </Card.Text>
                        <Button variant="primary"
                                style={{margin: '0.5em'}}
                                onClick={() => this.handleActionAnswer(yes)}
                        >YES
                        </Button>
                        <Button variant="primary"
                                onClick={() => this.handleActionAnswer(no)}
                        >NO
                        </Button>
                    </Card.Body>
                </Card>
                <Card style={{width: '18rem'}}>
                    <Card.Header>Reports</Card.Header>
                    <ListGroup variant="flush">
                        {(this.state.data) ? this.getReportsMatchingCurrentAction() : <span>Loading..</span>}
                        <ListGroup.Item action>First report</ListGroup.Item>
                        <ListGroup.Item action>Second report</ListGroup.Item>
                        <ListGroup.Item action>Third report</ListGroup.Item>
                    </ListGroup>
                    <Card.Footer>
                        <small className="text-muted">Based on 3 actions</small>
                    </Card.Footer>
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
