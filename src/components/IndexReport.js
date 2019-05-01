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
            bountyError: "",
            vulnerabilityError: "",
            genericErrorMessage: "*required",
            reportTitle: "",
            bounty: "",
            vulnerability: "",
            terms: null,
            selectedTerms: [],
            selectedTermNames: [],
            showTermsTree: false,
            vulns: null,
            selectedVuln: null,

        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleVulnboxChange = this.handleVulnboxChange.bind(this);
        this.handleSubmitIndexedReport = this.handleSubmitIndexedReport.bind(this);
        this.errors = this.errors.bind(this);
        this.fetchReport = this.fetchReport.bind(this);
        this.fetchTerms = this.fetchTerms.bind(this);
        this.arrangeTerms = this.arrangeTerms.bind(this);
        this.getTerms = this.getTerms.bind(this);
        this.showTerms = this.showTerms.bind(this);
    }

    componentDidMount() {
        this.fetchTerms()
        this.fetchVulns()
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

    fetchVulns(){
        fetch(server + "/vulnerabilities?size=100000&sort=name",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then((response) =>
            {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(data => this.arrangeVulns(data))
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

    arrangeVulns(rawTerms){
        let vulns = [];
        rawTerms.forEach((vuln) =>
            vulns.push({
                "name": vuln.name,
                "isChecked": false,
                "href": vuln.id,
            })
        );
        this.setState({vulns: vulns})
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if(name === "URL")
            this.fetchReport(value);

        this.setState({
            [name]: value,
            [name + "Error"]: null,
        });
    }

    /* https://medium.com/@tariqul.islam.rony/multiple-checkbox-handling-by-react-js-84b1d49a46c6 */
    handleVulnboxChange(event) {
        let vulns = this.state.vulns
        vulns.forEach(vuln => {
            if (vuln.name == event.target.value)
                vuln.isChecked =  event.target.checked
        })
        this.setState({vulns: vulns})
    }

    selectVulns() {
        if(this.state.vulns !== null){
            return <div id={"selectTermDiv"}>
                <p id={"formText"}>select vulnerability type below:</p>
                { this.state.vulns.map((vuln) =>
                    <ul id={"checkboxUl"} key={vuln.name}>
                        <label id={"labelBox"}>
                            <CheckBox handleCheckChildElement={this.handleVulnboxChange} {...vuln} />
                            <span id="boxTitle">{vuln.name + "   "}</span>
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

    inputForm(){
        return (
            <div>
                <label>
                    Report Title:
                    <input
                        id={"titleInput"}
                        name="reportTitle"
                        type="text"
                        value={this.state.reportTitle}
                        onChange={this.handleInputChange} />
                    {!!this.state.reportTitleError && (<p style={{color: 'red', float: "right"}}>{this.state.reportTitleError}</p>)}
                </label>
                <br />
                <label>
                    Bounty:
                    <input
                        name="bounty"
                        type="number"
                        value={this.state.bounty}
                        onChange={this.handleInputChange} />
                    {!!this.state.bountyError && (<p style={{color: 'red', float: "right"}}>{this.state.bountyError}</p>)}
                </label>
                <label>
                    Vulnerability Type:
                    <input
                        name="vulnerability"
                        type="text"
                        value={this.state.vulnerability}
                        onChange={this.handleInputChange} />
                    {!!this.state.vulnerabilityError && (<p style={{color: 'red', float: "right"}}>{this.state.vulnerabilityError}</p>)}
                </label>
            </div>
        )
    }

    showTerms(){
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

    showTermsTree(){
        if(this.state.showTermsTree === true){
        return <div>
            <TagSelection sendTerms={this.getTerms}/>
        </div>}
    }

    render(){
        return (
            <div>
                {this.URLInput()}
                <br/>
                {this.inputForm()}
                <br/>
                {this.selectVulns()}
                <br/>
                {this.showTerms()}
                <br/>
                <button onClick={()=> this.setState({showTermsTree: this.state.showTermsTree === false})}> show/hide terms</button>
                <br />
                {this.state.showTermsTree ? this.showTermsTree() : null}
                <br />
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
        if (this.state.bounty === null || this.state.bounty === "") {
            this.setState(() => ({ bountyError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.vulnerability === null || this.state.vulnerability === "") {
            this.setState(() => ({ vulnerabilityError: this.state.genericErrorMessage}));
            error = true;
        }
        /*if (this.state.reportTitle === null || this.state.reportTitle === "") {
            this.setState(() => ({ passwordError: this.state.genericErrorMessage}));
            error = true;
        }*/
        return error;

    }

    fetchReport(URL){
        const jsonRequest =
            {
                "url": URL,
            }
        fetch(server + "/reportData", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonRequest),
        })
            .then(response => response.json())
            .then(data =>{ console.log(data); this.setState({ reportTitle: data.title, bounty: data.bounty, vulnerability: data.vulnerability, termTitle: URL })});
    }

    getSelectedVulns() {
        let selectedVulns = [];
        this.state.vulns.forEach((vuln) =>
            vuln.isChecked ? selectedVulns.push(server + "/terms/" + vuln.href) : null
        );
        return selectedVulns;
    }

    /**
     * Checks for errors and then post json to server. Displays error message on failure.
     * @param event
     */
    handleSubmitIndexedReport() {
        let vulns = this.getSelectedVulns();
        let terms = this.state.selectedTerms;
        if(this.errors())
            return;
        const jsonRequest =
            {
                "title": this.state.reportTitle,
                "url": this.state.URL,
                "terms": terms.concat(vulns),
                "bounty": this.state.bounty,
            }
            console.log(jsonRequest)
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
                bountyError: "",
                vulnerabilityError: "",
                genericErrorMessage: "*required",
                reportTitle: "",
                bounty: "",
                vulnerability: "",
                selectedTerms: [],
                selectedTermNames: [],
                showTermsTree: false,
                selectedVuln: null,
            },
            this.componentDidMount()
        )
    }

}

export default  withRouter(IndexReport);