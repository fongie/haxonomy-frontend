import React, {Component} from "react";
import {server} from '../config';
import { withRouter } from 'react-router-dom';
import Tree from 'react-tree-graph';

/**
 * Presents the user with input fields for registration of new user. Given values are posted to the server using fetch.
 */
class Haxonomy extends Component{

    constructor(props) {
        super(props);

        this.state = {
            data: ""
        };

        this.loadGraphData();
    }

    loadGraphData = () => {
        this.data = {
            name: 'Parent',
            children: [{
                name: 'Child One'
            }, {
                name: 'Child Two'
            }]
        };
    };

    render() {
        return (
            <div>
                {console.log(this.data)}
                <Tree
                    data={this.data}
                    height={400}
                    width={400}/>
            </div>
        )
    }

}

export default withRouter(Haxonomy);