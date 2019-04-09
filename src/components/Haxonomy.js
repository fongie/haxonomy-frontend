import React, {Component} from "react";
import {server} from '../config';
import { withRouter } from 'react-router-dom';
import './Haxonomy.css';
import Tree from 'react-d3-tree';
import VerticallyCenteredModal from './VerticallyCenteredModal';


const myTreeData = [
    {
        name: 'Top Level',
        attributes: {
            keyA: 'val A',
            keyB: 'val B',
            keyC: 'val C',
        },
        children: [
            {
                name: 'Level 2: A',
                attributes: {
                    keyA: 'val A',
                    keyB: 'val B',
                    keyC: 'val C',
                },
            },
            {
                name: 'Level 2: B',
                children: [
                    {
                        name: 'Level 3: A',
                        attributes: {
                            keyA: 'val A',
                            keyB: 'val B',
                            keyC: 'val C',
                        },
                    },
                    {
                        name: 'Level 3: B',
                    },
                ],
            },
        ],
    },
];

const svgSquare = {
    shape: 'rect',
    shapeProps: {
        width: 100,
        height: 20,
        x: 0,
        y: -10,
    }
}

const textLayout = {
    textAnchor: "start",
    x: 5,
    y: 0,
    transform: undefined
}

const customStyles = {
    links: {},
    nodes: {
        node: {
            rect: {},
            name: {},
            attributes: {},
        },
        leafNode: {
            rect: {},
            name: {},
            attributes: {},
        },
    },
}




class Haxonomy extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            data: undefined,
            nodeData: undefined
        };

    }

    componentDidMount() {
        this.fetchTerms()
    }

    /**
     * GET all terms from server
     * https://haxonomy-backend.herokuapp.com/terms?=1000
     * <Tree data={this.state.data} />
     */
    fetchTerms = () => {
        console.log("Server is " + server);
        fetch(server + "/tree",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then((response) =>
            {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(res => {this.setState({data: res})
            })
            .catch(e => { alert(e.message);})

    }

    /**
     * Handles clicks on nodes, updates node data state and show modal
     * @param nodeData is the node data received from node onClick
     * @param evt is an event object that we don't use at the moment
     */
    handleClick = (nodeData, evt) => {
        this.setState({ modalShow: true, nodeData: nodeData})
    }

    render() {
        let modalClose = () => this.setState({ modalShow: false });

        if (!this.state.data) {
            return <p>LOADING..</p>
        } else {
        return (
                <div id="treeWrapper" style={{marginLeft: '5em', width: '100em', height: '50em'}}>

                        <VerticallyCenteredModal
                            show={this.state.modalShow}
                            onHide={modalClose}
                            nodeData={this.state.nodeData}
                        />

                    <Tree styles={customStyles} data={this.state.data} nodeSvgShape={svgSquare} textLayout={textLayout} collapsible={false} onClick={((nodeData, evt) => this.handleClick(nodeData, evt))}/>
                </div>
        );
        }
    }
}
export default withRouter(Haxonomy);
