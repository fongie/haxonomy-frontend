import React from "react";
import { Modal, Button } from 'react-bootstrap';
import VulnerabilityTable from './VulnerabilityTable';

const VerticallyCenteredModal = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Matching Reports
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>
                    {props.nodeData != null ? props.nodeData.name : 'Links'}
                </h4>
                <VulnerabilityTable vulns={props.vulns} />
                { //TODO root term vulnerability table is wrong - why
                    props.reports != null
                        ?
                        reportLinks(props.reports)
                        :
                        <p>Loading..</p>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

const reportLinks = (reports) => {
    return (
            <div>
                {
                    reports.length < 1
                        ?
                        <p>There are no reports in this category</p>
                        :
                        reports.map(
                            (report,i) =>
                                <LinkToReport
                                    title = {report.title}
                                    url = {report.url}
                                    bounty = {report.bounty}
                                    key = {i*213897123}
                                />
                        )
                }
            </div>
           );
}

const LinkToReport = (props) => (
        <div>
            <a
                href ={props.url}
                target = "_blank"
                rel="noopener noreferrer"
            >
                ${props.bounty} : {props.title}
            </a>
        </div>
        );

export default VerticallyCenteredModal;
