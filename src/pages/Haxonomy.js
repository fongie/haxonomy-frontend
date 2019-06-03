import React, {Component} from "react";
import _ from 'lodash';
import {server, terms, reports} from '../config';
import { withRouter } from 'react-router-dom';
import './Haxonomy.css';
import Tree from 'react-d3-tree';
import VerticallyCenteredModal from '../components/VerticallyCenteredModal';

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

class Haxonomy extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            data: undefined,
            nodeData: undefined,
            reportsInModal: null,
            vulnsInModal: [],
        };

        this.fetchTerms = this.fetchTerms.bind(this);
        this.fetchVulnerabilities = this.fetchVulnerabilities.bind(this);
    }

    componentDidMount() {
        this.fetchTerms()
    }

    fetchVulnerabilities() {
        let newVulns = []

        for (let i = 0; i < this.state.reportsInModal.length; i++) {
            let report = this.state.reportsInModal[i]
            let vuln = report.vulnerability

            if (typeof vuln == 'undefined' || typeof vuln.name == 'undefined') {
                continue;
            }

            if (_.find(newVulns, (obj) => vuln.name != undefined && obj.name === vuln.name)) {
                newVulns = newVulns.map(
                    (v) => v.name == vuln.name ? {name : v.name, count: v.count+=1} : v
                );
            } else {
                newVulns.push({
                    name: vuln.name,
                    count: 1
                })
            }
        }
        this.setState({ vulnsInModal: newVulns });
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

    fetchReports = (termId) => {
        const url = server + terms + "/" + termId + reports;
        fetch(url,
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then((response) => {
                console.log(response);
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(res => {this.setState({reportsInModal: res._embedded.reports})
            })
            .then(() => this.fetchVulnerabilities())
            .catch(e => { alert(e.message);})
    }


    /**
     * Handles clicks on nodes, updates node data state and show modal
     * @param nodeData is the node data received from node onClick
     * @param evt is an event object that we don't use at the moment
     */
    handleClick = (nodeData, evt) => {
        this.fetchReports(nodeData.termId);
        this.setState({ modalShow: true, nodeData: nodeData});
    }

    render() {
        let modalClose = () => this.setState({ modalShow: false, reportsInModal: null, vulnsInModal: [] });

        if (!this.state.data) {
            return <p>LOADING..</p>
        } else {
            return (
                <div id="treeWrapper" className="haxContainer">

                    <VerticallyCenteredModal
                        show={this.state.modalShow}
                        onHide={modalClose}
                        nodeData={this.state.nodeData}
                        reports={this.state.reportsInModal}
                        vulns={this.state.vulnsInModal}
                    />

                    <Tree
                        styles={customStyles}
                        pathFunc={"diagonal"}
                        nodeSize={nodeSize}
                        data={this.state.data}
                        orientation={'horizontal'}
                        zoom={0.6}
                        separation={separation}
                        nodeSvgShape={svgSquare}
                        textLayout={textLayout}
                        collapsible={false}
                        onClick={((nodeData, evt) => this.handleClick(nodeData, evt))}
                    />

                </div>
            );
        }
    }
}
export default withRouter(Haxonomy);
