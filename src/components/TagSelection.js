import React, {Component} from "react";
import {server, terms, reports} from '../config';
import { withRouter } from 'react-router-dom';
import '../pages/Haxonomy.css';
import Tree from 'react-d3-tree';
import VerticallyCenteredModal from './VerticallyCenteredModal';

/**
 * Layout of rectangle formed nodes
 * @type {{shape: string, shapeProps: {width: number, height: number, x: number, y: number, rx: number, ry: number}}}
 */
const svgSquare = {
    shape: 'rect',
    shapeProps: {
        width: 190,
        height: 22,
        x: 0,
        y: -11,
        rx: 5,
        ry: 5,
    }
}

/**
 *
 * @type {{textAnchor: string, x: number, y: number, transform: undefined}}
 */
const textLayout = {
    textAnchor: "start",
    x: 5,
    y: 0,
    transform: undefined,
}

const customStyles = {
    links: {
        stroke: 'silver'
    },
    nodes: {
        node: {
            circle: {
                fill: '#fc968a',
                stroke: '#c66257'
            },
            name: {
                stroke: '#4f2520',
                fill: '#4f2520'
            },
            attributes: {},
        },
        leafNode: {
            circle: {
                fill: '#fff',
                stroke: '#999'
            },
            name: {
                stroke: '#424242',
                fill: '#424242'
            },
            attributes: {},
        },
    },
}

const separation = {
    siblings: 0.2,
    nonSiblings: 0.5
}

const nodeSize = {
    x: 250,
    y: 140
}

class TagSelection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: undefined,
            nodeData: undefined,
            reportsInModal: null,
        };

        this.fetchTerms = this.fetchTerms.bind(this);
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
        fetch(server + "/tree",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then((response) => {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(res => {this.setState({data: res})
            })
            .catch(e => { alert(e.message);})
    }

    /**
     * Handles clicks on nodes and updates node data state
     * @param nodeData is the node data received from node onClick
     * @param evt is an event object that we don't use at the moment
     */
    handleClick = (nodeData, evt) => {
        this.props.sendTerms(nodeData)
    }

    render() {
        if (!this.state.data) {
            return <p>LOADING..</p>
        } else {
            return (
                <div id="treeWrapper" className="haxContainer">

                    <Tree
                        styles={customStyles}
                        pathFunc={"diagonal"}
                        nodeSize={nodeSize}
                        data={this.state.data}
                        orientation={'horizontal'}
                        zoom={0.49}
                        separation={separation}
                        nodeSvgShape={svgSquare}
                        textLayout={textLayout}
                        collapsible={false}
                        onClick={((nodeData, evt) => this.handleClick(nodeData, evt))}
                        separation={{siblings: 0.15, nonSiblings: 0.20}}
                        zoomable={false}
                        translate={{
                            x: 20,
                            y: 550
                        }}
                    />

                </div>
            );
        }
    }
}
export default withRouter(TagSelection);
