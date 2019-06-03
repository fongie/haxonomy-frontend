import React, {Component} from "react";
import { withRouter } from 'react-router-dom'
import IndexReport from "../components/IndexReport";
import AddTerm from "../components/AddTerm";
import './Administrate.css';

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
                <div className={"formComponentDiv"}>
                    <h3>Add Report</h3>
                    <br />
                    <IndexReport/>
                </div>
                <div className={"formComponentDiv"}>
                    <h3>Add Term</h3>
                    <br />
                    <AddTerm/>
                </div>
                <br />
                <br />
            </div>
        )
    }
}

export default  withRouter(Administrate);