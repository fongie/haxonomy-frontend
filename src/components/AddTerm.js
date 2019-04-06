import React, {Component} from "react";
import {server} from '../config';
import { withRouter } from 'react-router-dom'
import CheckBox from './CheckBox';
import './AddTerm.css';

/**
 * Presents the user with input fields for registration of new user. Given values are posted to the server using fetch.
 */
class AddTerm extends Component{

    componentDidUpdate(){

    }

    constructor(props) {
        super(props)

        this.state = {
            termTitle: "",
            password: "",
            termTitleError: "",
            genericErrorMessage: "*required",
            terms: null,
            parent: []

        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleSubmitTerm = this.handleSubmitTerm.bind(this);
        this.errors = this.errors.bind(this);
        this.fetchReport = this.fetchReport.bind(this);
        this.processURL = this.processURL.bind(this);
        this.fetchTerms = this.fetchTerms.bind(this);
        this.arrangeTerms = this.arrangeTerms.bind(this);
    }

    componentDidMount() {
        this.fetchTerms()
    }


    fetchTerms(){
        fetch(server + "/terms?limit=24",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then((response) =>
            {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(data => this.arrangeTerms(data))
            .catch(e => { alert(e.message);})
    }

    arrangeTerms(rawTerms){
        let terms = [];
        console.log(rawTerms)
        rawTerms._embedded.terms.forEach((term) =>
            terms.push({
                "name": term.name,
                "isChecked": false,
                "href": term._links.self.href,
            })
        );
        this.setState({terms: terms}, console.log(this.state.terms))
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            [name + "Error"]: null,
        });
    }

    /* https://medium.com/@tariqul.islam.rony/multiple-checkbox-handling-by-react-js-84b1d49a46c6 */
    handleCheckboxChange(event) {
        let terms = this.state.terms
        terms.forEach(term => {
            if (term.name === event.target.value)
                term.isChecked =  event.target.checked
        })
        this.setState({terms: terms}, console.log(terms))
    }

    processURL(event){

        this.setState({ termTitle: event.target.value })
        // this.fetchReport(event.target.value);
    }

    selectTerms() {
        if(this.state.terms !== null){
            return <div id={"selectTermDiv"}>
                <p id={"formText"}>select parent below:</p>
                { this.state.terms.map((term) =>
                    <ul id={"checkboxUl"} key={term.name}>
                        <label id={"labelBox"}>
                            <CheckBox handleCheckChildElement={this.handleCheckboxChange} {...term} />
                            <span id="boxTitle">{term.name + "   "}</span>
                        </label></ul>)}
            </div>;

        }
    }

    titleInput(){
        return (
            <label>
                Term Title:
                <input
                    name="termTitle"
                    type="text"
                    value={this.state.termTitle}
                    onChange={this.handleInputChange} />
                {!!this.state.termTitleError && (<p style={{color: 'red', float: "right"}}>{this.state.termTitleError}</p>)}
            </label>)
    }


    render(){
        return (
            <div >
                {this.titleInput()}
                <br/>
                <p>{this.state.reportTitle}</p>
                <br />
                {this.selectTerms()}
                <br/>
                <button onClick={()=>this.handleSubmitTerm()}>submit</button>
                <br />
            </div>
        )
    }

    /**
     * Checks if any of the input fields are empty and in that case sets the corresponding error state variable to an
     * error message.
     * @returns {boolean}
     */
    errors(){
        let error = false;
        if (this.state.termTitle === null || this.state.termTitle === "") {
            this.setState(() => ({ termTitleError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.reportTitle === null || this.state.reportTitle === "") {
            this.setState(() => ({ passwordError: this.state.genericErrorMessage}));
            error = true;
        }
        return error;

    }

    fetchReport(URL){

        fetch(URL + ".json", {
            credentials: 'include',
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ reportTitle: data.title, termTitle: URL }, console.log("hej")));
    }

    getSelectedParent() {
        let selectedParent = "";
        this.state.terms.forEach((term) =>
            term.isChecked ? selectedParent = term.href : null
        );
        return selectedParent;
    }

    /**
     * Checks for errors and then post json to server. Displays error message on failure.
     * @param event
     */
    handleSubmitTerm() {
        if(this.errors())
            return;
        const jsonRequest =
            {
                "name": this.state.termTitle,
                "broaderTerm": this.getSelectedParent(),

            }
        fetch(server + '/terms', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonRequest),
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response)
            if ((response.error) && response.status === 409) {throw new Error("The report already exists, please try another.")}
            if(response.error) throw new Error("Something went wrong, please try again in a few minutes");
            else return response;
        }).then((data) => {
            alert("Term created");
            this.resetState();

        })
            .catch((e) => {
                alert(e.message);
            });
    }

    resetState(){
        this.setState({
            termTitle: "",
            password: "",
            termTitleError: "",
            genericErrorMessage: "*required",
            terms: null,
            parent: []
        },
            this.componentDidMount()
        )
    }

}

export default  withRouter(AddTerm);