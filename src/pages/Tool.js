import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

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
                <p>tool</p>
            </div>
        )
    }

}

export default withRouter(Tool);
