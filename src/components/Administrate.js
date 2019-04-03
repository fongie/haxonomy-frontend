import React, {Component} from "react";
import {server} from '../config';
import { withRouter } from 'react-router-dom'
import IndexReport from "./IndexReport";
import AddTerm from "./AddTerm";

/**
 * Presents the user with input fields for registration of new user. Given values are posted to the server using fetch.
 */
class Administrate extends Component{

    componentDidUpdate(){

    }

    constructor(props) {
        super(props)

        this.state = {

        }

    }
    render(){
        return (
            <div>
                <IndexReport/>
                <AddTerm/>
            </div>
        )
    }
}

export default  withRouter(Administrate);