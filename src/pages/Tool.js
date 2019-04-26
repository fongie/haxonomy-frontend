import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {C} from "react-bootstrap";

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
                <card>

                </card>
            </div>
        )
    }

}

export default withRouter(Tool);
