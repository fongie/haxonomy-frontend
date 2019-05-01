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
            time: "",
            timeError: "",
            password: "",
            termTitleError: "",
            genericErrorMessage: "*required",
            terms: null,
            parent: [],
            times: null,


        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTermboxChange = this.handleTermboxChange.bind(this);
        this.handleTimeboxChange = this.handleTimeboxChange.bind(this);
        this.handleSubmitTerm = this.handleSubmitTerm.bind(this);
        this.errors = this.errors.bind(this);
        this.fetchReport = this.fetchReport.bind(this);
        this.processURL = this.processURL.bind(this);
        this.fetchTerms = this.fetchTerms.bind(this);
        this.arrangeTerms = this.arrangeTerms.bind(this);
        this.arrangeTimes = this.arrangeTimes.bind(this);
    }

    componentDidMount() {
        this.fetchTerms()
        this.fetchTimes()
    }


    fetchTerms(){
        fetch(server + "/terms?size=100000&sort=name",
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

    fetchTimes(){
        fetch(server + "/times?size=100000&sort=time",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then((response) =>
            {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(data => this.arrangeTimes(data))
            .catch(e => { alert(e.message);})
    }

    arrangeTerms(rawTerms){
        let terms = [];
        rawTerms._embedded.terms.forEach((term) =>
            terms.push({
                "name": term.name,
                "isChecked": false,
                "href": term._links.self.href,
            })
        );
        this.setState({terms: terms})
    }

    arrangeTimes(rawTimes){
        let times = [];
        rawTimes._embedded.times.forEach((time) =>
            times.push({
                "name": time.time,
                "isChecked": false,
                "href": time._links.self.href,
            })
        );
        this.setState({times: times})
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
    handleTermboxChange(event) {
        let terms = this.state.terms
        terms.forEach(term => {
            if (term.name === event.target.value)
                term.isChecked =  event.target.checked
        })
        this.setState({terms: terms})
    }

    handleTimeboxChange(event) {
        let times = this.state.times
        times.forEach(time => {
            if (time.name == event.target.value) {
                time.isChecked = event.target.checked
            }
        })
        this.setState({times: times})
    }


    processURL(event){

        this.setState({ termTitle: event.target.value })
        // this.fetchReport(event.target.value);
    }

    selectTerms() {
        if(this.state.terms !== null){
            return <div id={"selectTermDiv"}>
                <p id={"formText"}>select broader term below:</p>
                { this.state.terms.map((term) =>
                    <ul id={"checkboxUl"} key={term.name}>
                        <label id={"labelBox"}>
                            <CheckBox handleCheckChildElement={this.handleTermboxChange} {...term} />
                            <span id="boxTitle">{term.name + "   "}</span>
                        </label></ul>)}
            </div>;

        }
    }

    selectTime() {
        if(this.state.times !== null){
            return <div id={"selectTimeDiv"}>
                <p id={"formText"}>select time below:</p>
                { this.state.times.map((time) =>
                    <ul id={"checkboxUl"} key={time.name}>
                        <label id={"labelBox"}>
                            <CheckBox handleCheckChildElement={this.handleTimeboxChange} {...time} />
                            <span id="boxTitle">{time.name}</span>
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
                {this.selectTime()}
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
        if (this.state.time === null || this.state.time === "") {
            this.setState(() => ({ timeError: this.state.genericErrorMessage}));
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
            .then(data => this.setState({ reportTitle: data.title, termTitle: URL }));
    }

    getSelectedParent() {
        let selectedParent = "";
        this.state.terms.forEach((term) =>
            term.isChecked ? selectedParent = term : null
        );
        return selectedParent;
    }

    getSelectedTime() {
        let selectedTime = "";
        this.state.times.forEach((time) =>
            time.isChecked ? selectedTime = time : null
        );
        return selectedTime;
    }

    /**
     * Checks for errors and then post json to server. Displays error message on failure.
     * @param event
     */
    handleSubmitTerm() {
        let selectedParent = this.getSelectedParent();
        let selectedTime = this.getSelectedTime();
        if (!window.confirm("Term name is: \"" + this.state.termTitle + "\" \nSelected parent is: \"" + selectedParent.name + "\" \nSelected time is: \"" + selectedTime.name + "\".\n\n\t\t\tOK?"))
            return;
        if(this.errors())
            return;
        const jsonRequest =
            {
                "name": this.state.termTitle,
                "broaderTerm": selectedParent.href,
                "time": selectedTime.href,
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
                time: "",
                timeError: "",
                password: "",
                termTitleError: "",
                genericErrorMessage: "*required",
                parent: [],
        },
            this.componentDidMount()
        )
    }

}

export default  withRouter(AddTerm);