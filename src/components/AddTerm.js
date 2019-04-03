import React, {Component} from "react";
import {server} from '../config';
import { withRouter } from 'react-router-dom'

/**
 * Presents the user with input fields for registration of new user. Given values are posted to the server using fetch.
 */
class AddTerm extends Component{

    componentDidUpdate(){

    }

    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            emailError: "",
            passwordError: "",
            genericErrorMessage: "*required"

        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.errors = this.errors.bind(this);
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

    render(){
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Email:
                    <input
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleInputChange} />
                    {!!this.state.emailError && (<p style={{color: 'red', float: "right"}}>{this.state.emailError}</p>)}
                </label>
                <br />
                <label>
                    Password:
                    <input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleInputChange} />
                    {!!this.state.passwordError && (<p style={{color: 'red', float: "right"}}>{this.state.passwordError}</p>)}
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        )
    }

    /**
     * Checks if any of the input fields are empty and in that case sets the corresponding error state variable to an
     * error message.
     * @returns {boolean}
     */
    errors(){
        let error = false;
        if (this.state.email === null || this.state.email === "") {
            this.setState(() => ({ emailError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.password === null || this.state.password === "") {
            this.setState(() => ({ passwordError: this.state.genericErrorMessage}));
            error = true;
        }
        return error;

    }

    /**
     * Checks for errors and then post form to server. Redirects to login page on success, displays error message on failure.
     * @param event
     */
    handleSubmit(event) {
        event.preventDefault();
        if(this.errors())
            return;
        const jsonRequest =
            {
                "password": this.state.password,
                "email": this.state.email,
            }
        fetch(server + '/registration', {
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
            if ((response.error) && response.status === 409) {throw new Error("The username already exists, please try another.")}
            if(response.error) throw new Error("Something went wrong, please try again in a few minutes");
            else return response;
        }).then((data) => {
                alert("User created");
            this.props.history.replace('/login');
            })
            .catch((e) => {
                alert(e.message);
            });
    }
}

export default  withRouter(AddTerm);