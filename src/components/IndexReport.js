import React, {Component} from "react";
import {server} from '../config';
import { withRouter } from 'react-router-dom'
import CheckBox from './CheckBox';
import './IndexReport.css';
import TagSelection from '../components/TagSelection';

/**
 * Presents the user with input fields for registration of new user. Given values are posted to the server using fetch.
 */
class IndexReport extends Component{

    componentDidUpdate(){

    }

    constructor(props) {
        super(props)

        this.state = {
            URL: "",
            password: "",
            URLError: "",
            reportTitleError: "",
            genericErrorMessage: "*required",
            reportTitle: "",
            terms: null,
            selectedTerms: [],
            selectedTermNames: [],

        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleSubmitIndexedReport = this.handleSubmitIndexedReport.bind(this);
        this.errors = this.errors.bind(this);
        this.fetchReport = this.fetchReport.bind(this);
        this.processURL = this.processURL.bind(this);
        this.fetchTerms = this.fetchTerms.bind(this);
        this.arrangeTerms = this.arrangeTerms.bind(this);
        this.getTerms = this.getTerms.bind(this);
        this.showTerms = this.showTerms.bind(this);
    }

    componentDidMount() {
        this.fetchTerms()
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
        this.setState({terms: terms})
    }

    processURL(event){

        this.setState({ termTitle: event.target.value })
        //this.fetchReport(event.target.value);
    }

    selectTerms() {
        if(this.state.terms !== null){
            return <div id={"selectTermDiv"}>
                <p id={"formText"}>select terms below:</p>
                    { this.state.terms.map((term) =>
                        <ul id={"checkboxUl"} key={term.name}>
                        <label id={"labelBox"}>
                            <CheckBox handleCheckChildElement={this.handleCheckboxChange} {...term} />
                            <span id="boxTitle">{term.name + "   "}</span>
                        </label></ul>)}
            </div>;

        }
    }

    URLInput(){
        return (
        <label>
            Report URL:
            <input
                name="URL"
                type="URL"
                value={this.state.URL}
                onChange={this.handleInputChange} />
            {!!this.state.URLError && (<p style={{color: 'red', float: "right"}}>{this.state.URLError}</p>)}
        </label>)
    }

    reportTitleInput(){
        return (
            <label>
                Report Title:
                <input
                    name="reportTitle"
                    type="text"
                    value={this.state.reportTitle}
                    onChange={this.handleInputChange} />
                {!!this.state.reportTitleError && (<p style={{color: 'red', float: "right"}}>{this.state.reportTitleError}</p>)}
            </label>)
    }

    showTerms(){
        console.log(this.state.selectedTermNames)
        if(this.state.selectedTermNames !== null){
            return <div>
                { this.state.selectedTermNames.map((term) =>
                    <text>{term + ", "}</text>)
                }
            </div>
        }
    }

    getTerms(selectedTerm){
        let selectedTerms = this.state.selectedTerms;
        let selectedTermNames = this.state.selectedTermNames;
        let selectedTermHref = null;
        let remove = -1;
        this.state.terms.forEach((term) =>
            term.name === selectedTerm.name ? selectedTermHref = term.href : null
        );
        this.state.selectedTerms.forEach((term, index) =>{
            if (term === selectedTermHref)
                remove = index
        }
        );
        remove > -1 ?  selectedTerms.splice(remove, 1) : selectedTerms.push(selectedTermHref)
        remove > -1 ?  selectedTermNames.splice(remove, 1) : selectedTermNames.push(selectedTerm.name)
        this.setState({selectedTerms: selectedTerms, selectedTermNames: selectedTermNames}, console.log(this.state.selectedTerms));
    }

    render(){
        return (
            <div>
                {this.reportTitleInput()}
                <br/>
                {this.URLInput()}
                <br/>
                <p>{this.state.reportTitle}</p>
                <br />
                <button onClick={()=>this.fetchTerms()}>refresh terms</button>
                <br />
                {this.showTerms()}
                <br />
                <TagSelection sendTerms={this.getTerms}/>
                {/*{this.selectTerms()}*/}
                <br/>
                <button onClick={()=>this.handleSubmitIndexedReport()}>submit</button>
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
        if (this.state.URL === null || this.state.URL === "") {
            this.setState(() => ({ termTitleError: this.state.genericErrorMessage}));
            error = true;
        }
        /*if (this.state.reportTitle === null || this.state.reportTitle === "") {
            this.setState(() => ({ passwordError: this.state.genericErrorMessage}));
            error = true;
        }*/
        return error;

    }

    fetchReport(URL){

        fetch(URL + ".json", {
            credentials: 'include',
            method: 'GET',
            dataType: 'jsonp',
        })
            .then(response => response.json())
            .then(data =>{ console.log(data); this.setState({ reportTitle: data.title, termTitle: URL })});
    }

    getSelectedTerms() {
        let selectedTerms = [];
        this.state.terms.forEach((term) =>
            term.isChecked ? selectedTerms.push(term.href) : null
        );
        return selectedTerms;
    }

    /**
     * Checks for errors and then post json to server. Displays error message on failure.
     * @param event
     */
    handleSubmitIndexedReport() {
        if(this.errors())
            return;
        const jsonRequest =
            {
                "title": this.state.reportTitle,
                "url": this.state.URL,
                "terms": this.getSelectedTerms(),

            }
        fetch(server + '/reports', {
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
                alert("Report created");
                this.resetState();
            })
            .catch((e) => {
                alert(e.message);
            });
    }

    resetState(){
        this.setState({
                URL: "",
                password: "",
                URLError: "",
                reportTitleError: "",
                genericErrorMessage: "*required",
                reportTitle: "",
                terms: null,
                selectedTerms: [],
                selectedTermNames: [],
            },
            this.componentDidMount()
        )
    }

}

export default  withRouter(IndexReport);