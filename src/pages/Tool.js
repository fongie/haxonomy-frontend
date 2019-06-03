import React, {Component} from 'react';
import './Tool.css';
import {server, replies, markovaction, tool, next, init, terms, reports} from '../config';
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
            data: null,
            numberOfActions: 0,
            actionStatus: unknown, // must be YES or NO before sending to backend
            markovStateId: 1,
            reports: null,
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

    fetchReports = (termId) => {
        const url = server + terms + "/" + termId + reports;
        fetch(url,
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then((response) => {
                console.log(response);
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(res => {this.setState({reports: res._embedded.reports}, console.log(this.state.reports))
            })
            .catch(e => { alert(e.message);})
    }


    /**
     * GETs the next action in a specified markov state (right now hardcoded to state 1)
     */
    fetchNextAction = () => {
        console.log(this.state.markovStateId)
        fetch(server + tool + "/" + this.state.markovStateId + next,
            {credentials: 'include',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        ).then(res => res.json())
            .then((response) => {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(res => {
                if(res.id !== 999999999){
                    if(res.term.broaderTerm.name === "Vulnerabilities"){
                        if(res.reply.name === no){
                            this.setState({data: res, markovStateId: res.markovState.id, actionStatus: no}, this.sendActionAnswerToServer)}
                        else{
                            this.setState({vulnMode: true, data: res, markovStateId: res.markovState.id, numberOfActions: this.state.numberOfActions + 1}, this.fetchReports(res.term.id))}
                    }
                    else{
                        this.setState({data: res, markovStateId: res.markovState.id, numberOfActions: this.state.numberOfActions + 1})}
                }
                else{
                    this.reset();
                    alert("No more suggestions. Need more training. Resetting suggestions")
                }


            })
            .catch(e => {
                alert(e.message);
            });
    };

    fetchOtherNextAction = () => {
        console.log(this.state.markovStateId)
        fetch(server + tool + "/mismatch/" + this.state.markovStateId + "/" + this.state.actionStatus + "/" + this.state.data.term.id,
            {credentials: 'include',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        ).then(res => res.json())
            .then((response) => {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(res => {
                if(res.id !== 999999999){
                    if(res.term.broaderTerm.name === "Vulnerabilities"){
                        if(res.reply.name === no){
                            this.setState({data: res, markovStateId: res.markovState.id, actionStatus: no}, this.sendActionAnswerToServer)}
                        else{
                            this.setState({vulnMode: true, data: res, markovStateId: res.markovState.id, numberOfActions: this.state.numberOfActions + 1}, this.fetchReports(res.term.id))}
                    }
                    else{
                        this.setState({data: res, markovStateId: res.markovState.id, numberOfActions: this.state.numberOfActions + 1})}
                }
                else{
                    this.reset();
                    alert("No more suggestions. Need more training. Resetting suggestions")
                }


            })
            .catch(e => {
                alert(e.message);
            });
    }

    /**
     * Updates answer to YES or NO, then calls the server via sendActionAnswerToServer, because of async
     * @param answer
     */
    handleActionAnswer = (answer) => {
        if(answer === yes && this.state.data)
            this.fetchReports(this.state.data.term.id)

        this.setState({actionStatus: answer}, this.sendActionAnswerToServer);
    };

    sendActionAnswerToServer = () => {
        console.log(this.state.actionStatus)
        if(this.state.actionStatus !== unknown){

            //check if the answer from the user, actionStatus === the Reply (YES or NO) that we got from the server when answering this question
            if (this.state.actionStatus === this.state.data.reply.name){
                this.fetchNextAction();
            } else {
                this.fetchOtherNextAction();
            }
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
            <div>
                <br/>
                <CardDeck>
                    {this.state.vulnMode ? this.vulnBox() : this.nextActionBox()}
                    <Card style={{width: '18rem'}}>
                        <Card.Header>Reports</Card.Header>
                        <ListGroup variant="flush">
                            {/*{(this.state.data) ? this.getReportsMatchingCurrentAction() : <span>Loading..</span>}*/}
                            {
                                this.state.reports != null
                                    ?
                                    reportLinks(this.state.reports)
                                    :
                                    <p>Loading..</p>
                            }
                        </ListGroup>
                        <Card.Footer>
                            <small className="text-muted">{"Based on " + this.state.numberOfActions + " questions"}</small>
                        </Card.Footer>
                    </Card>
                </CardDeck>
            </div>
        )
    }

    vulnBox(){
        return <Card style={{width: '45vw'}}>
            <Card.Body>
                <Card.Title>
                    VULNERABILITY ALERT
                </Card.Title>
                <Card.Text>
                    {(this.state.data) ? "Try the following attack: " + this.state.data.term.name  : <p>LOADING..</p>}
                </Card.Text>
                <Button variant="primary"
                        style={{margin: '0.5em'}}
                        onClick={() => this.setState({vulnMode: false}, this.handleActionAnswer(yes))}
                >SUCCESS
                </Button>
                <Button variant="primary"
                        onClick={() => this.setState({vulnMode: false}, this.handleActionAnswer(no))}
                >FAIL
                </Button>
            </Card.Body>
        </Card>
    }

    nextActionBox(){
        return <Card style={{width: '45vw'}}>
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
    }

    reset() {
        this.setState({
            data: null,
            numberOfActions: 0,
            actionStatus: unknown, // must be YES or NO before sending to backend
            markovStateId: 1,
        }, this.fetchNextAction())
    }


}

const reportLinks = (reports) => {
    return (
        <div>
            {
                reports.length < 1
                    ?
                    <p>There are no reports in this category</p>
                    :
                    reports.map(
                        (report) =>
                            <LinkToReport
                                title = {report.title}
                                url = {report.url}
                            />
                    )
            }
        </div>
    );
}
const LinkToReport = (props) => (
    <div>
        <a
            href ={props.url}
            target = "_blank"
            rel="noopener noreferrer"
        >
            {props.title}
        </a>
    </div>
);

export default Tool;
