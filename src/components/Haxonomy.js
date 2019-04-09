import React, {Component} from "react";
import {server} from '../config';
import { withRouter } from 'react-router-dom';
import './Haxonomy.css';
import Tree from 'react-d3-tree';
import VerticallyCenteredModal from './VerticallyCenteredModal';

const maxData = [
    {
        "termId": 1,
        "name": "attack surfaces",
        "children": [{
            "termId": 11,
            "name": "language",
            "children": [{
                "termId": 81,
                "name": "programming language",
                "children": [{"termId": 321, "name": "python", "children": []}, {
                    "termId": 331,
                    "name": "javascript",
                    "children": []
                }, {"termId": 341, "name": "coffeescript", "children": []}, {
                    "termId": 351,
                    "name": "css",
                    "children": []
                }, {"termId": 361, "name": "php", "children": []}, {
                    "termId": 371,
                    "name": "java",
                    "children": []
                }, {"termId": 381, "name": "asp", "children": []}]
            }, {
                "termId": 91,
                "name": "markup language",
                "children": [{"termId": 391, "name": "html", "children": []}, {
                    "termId": 401,
                    "name": "svg",
                    "children": []
                }, {"termId": 411, "name": "xml", "children": []}, {"termId": 421, "name": "json", "children": []}]
            }, {
                "termId": 101,
                "name": "frameworks & libraries",
                "children": [{"termId": 431, "name": "angularjs", "children": []}, {
                    "termId": 441,
                    "name": "jquery",
                    "children": []
                }, {"termId": 451, "name": "django", "children": []}, {
                    "termId": 461,
                    "name": "ajax",
                    "children": []
                }, {"termId": 471, "name": "bootstrap", "children": []}]
            }]
        }, {
            "termId": 21,
            "name": "source code",
            "children": [{
                "termId": 111,
                "name": "source code resources",
                "children": [{"termId": 481, "name": "github", "children": []}, {
                    "termId": 491,
                    "name": "wayback machine",
                    "children": []
                }, {"termId": 501, "name": "crawler", "children": []}]
            }, {
                "termId": 121,
                "name": "source code vulnerabilities",
                "children": [{"termId": 511, "name": "json stringify", "children": []}, {
                    "termId": 521,
                    "name": "broken html",
                    "children": []
                }, {"termId": 531, "name": "canary protection", "children": []}, {
                    "termId": 541,
                    "name": "concatenation",
                    "children": []
                }, {"termId": 551, "name": "dom", "children": []}, {
                    "termId": 561,
                    "name": "location property",
                    "children": []
                }, {"termId": 571, "name": "unsanitized characters", "children": []}, {
                    "termId": 581,
                    "name": "validation",
                    "children": []
                }, {"termId": 591, "name": "templating", "children": []}, {
                    "termId": 601,
                    "name": "configuration",
                    "children": []
                }]
            }]
        }, {
            "termId": 31,
            "name": "user interface",
            "children": [{
                "termId": 171,
                "name": "website elements",
                "children": [{
                    "termId": 611,
                    "name": "upload",
                    "children": [{"termId": 631, "name": "file upload", "children": []}, {
                        "termId": 641,
                        "name": "image upload",
                        "children": []
                    }]
                }, {
                    "termId": 621,
                    "name": "text input",
                    "children": [{"termId": 651, "name": "login", "children": []}, {
                        "termId": 661,
                        "name": "form",
                        "children": []
                    }, {"termId": 671, "name": "search field", "children": []}, {
                        "termId": 681,
                        "name": "editor",
                        "children": []
                    }]
                }]
            }, {
                "termId": 181,
                "name": "website functionality",
                "children": [{"termId": 691, "name": "account", "children": []}, {
                    "termId": 701,
                    "name": "payment",
                    "children": []
                }, {"termId": 711, "name": "profile", "children": []}, {
                    "termId": 721,
                    "name": "membership",
                    "children": []
                }, {"termId": 731, "name": "subscription", "children": []}]
            }]
        }, {
            "termId": 41,
            "name": "network & communication",
            "children": [{
                "termId": 131,
                "name": "request",
                "children": [{
                    "termId": 741,
                    "name": "url",
                    "children": [{"termId": 821, "name": "path", "children": []}, {
                        "termId": 831,
                        "name": "deeplink",
                        "children": []
                    }]
                }, {
                    "termId": 751,
                    "name": "parameter",
                    "children": [{"termId": 841, "name": "http parameter", "children": []}, {
                        "termId": 851,
                        "name": "sid parameter",
                        "children": []
                    }, {"termId": 861, "name": "single-character parameter", "children": []}, {
                        "termId": 871,
                        "name": "ssrf protection",
                        "children": []
                    }, {"termId": 881, "name": "insecure direct object reference", "children": []}, {
                        "termId": 891,
                        "name": "csrf protection",
                        "children": []
                    }]
                }, {
                    "termId": 761,
                    "name": "header",
                    "children": [{"termId": 901, "name": "user-agent header", "children": []}, {
                        "termId": 911,
                        "name": "same-origin",
                        "children": []
                    }, {"termId": 921, "name": "security header", "children": []}, {
                        "termId": 931,
                        "name": "cookie",
                        "children": []
                    }, {"termId": 941, "name": "content security policy", "children": []}]
                }, {"termId": 771, "name": "post", "children": []}, {
                    "termId": 781,
                    "name": "get",
                    "children": []
                }, {"termId": 791, "name": "put", "children": []}, {
                    "termId": 801,
                    "name": "delete",
                    "children": []
                }, {"termId": 811, "name": "status codes", "children": []}]
            }, {
                "termId": 141,
                "name": "protocol",
                "children": [{"termId": 951, "name": "http", "children": []}, {
                    "termId": 961,
                    "name": "https",
                    "children": []
                }]
            }, {
                "termId": 151,
                "name": "redirect",
                "children": [{"termId": 971, "name": "server redirect", "children": []}, {
                    "termId": 981,
                    "name": "client redirect",
                    "children": []
                }]
            }, {
                "termId": 161,
                "name": "dns",
                "children": [{"termId": 991, "name": "cname", "children": []}, {
                    "termId": 1001,
                    "name": "fqdn",
                    "children": []
                }, {"termId": 1011, "name": "subdomain", "children": []}, {
                    "termId": 1021,
                    "name": "web cache",
                    "children": []
                }]
            }]
        }, {
            "termId": 51,
            "name": "server",
            "children": [{
                "termId": 191,
                "name": "cloud services",
                "children": [{"termId": 1031, "name": "azure", "children": []}, {
                    "termId": 1041,
                    "name": "amazon",
                    "children": []
                }, {"termId": 1051, "name": "google cloud", "children": []}, {
                    "termId": 1061,
                    "name": "heroku",
                    "children": []
                }]
            }, {
                "termId": 201,
                "name": "operating system",
                "children": [{"termId": 1071, "name": "linux", "children": []}, {
                    "termId": 1081,
                    "name": "windows nt",
                    "children": []
                }, {"termId": 1091, "name": "windows", "children": []}, {"termId": 1101, "name": "osx", "children": []}]
            }, {
                "termId": 211,
                "name": "server software",
                "children": [{"termId": 1111, "name": "apache http server", "children": []}, {
                    "termId": 1121,
                    "name": "apache tomcat",
                    "children": []
                }, {"termId": 1131, "name": "jetty", "children": []}, {
                    "termId": 1141,
                    "name": "nginx",
                    "children": []
                }, {
                    "termId": 1151,
                    "name": "cms",
                    "children": [{"termId": 1161, "name": "wordpress", "children": []}, {
                        "termId": 1171,
                        "name": "buddypress",
                        "children": []
                    }]
                }]
            }, {
                "termId": 221,
                "name": "database",
                "children": [{"termId": 1181, "name": "mysql", "children": []}, {
                    "termId": 1191,
                    "name": "postgres",
                    "children": []
                }]
            }, {
                "termId": 231,
                "name": "server techniques",
                "children": [{"termId": 1201, "name": "sandboxing", "children": []}, {
                    "termId": 1211,
                    "name": "virtual machine",
                    "children": []
                }]
            }, {"termId": 241, "name": "port", "children": []}, {"termId": 251, "name": "host", "children": []}]
        }, {
            "termId": 61,
            "name": "account security",
            "children": [{
                "termId": 261,
                "name": "authorization",
                "children": [{"termId": 1221, "name": "privilege", "children": []}, {
                    "termId": 1231,
                    "name": "write-access",
                    "children": []
                }, {"termId": 1241, "name": "administrator", "children": []}, {
                    "termId": 1251,
                    "name": "read-access",
                    "children": []
                }]
            }, {
                "termId": 271,
                "name": "authentication",
                "children": [{
                    "termId": 1261,
                    "name": "token",
                    "children": [{"termId": 1301, "name": "csrf token", "children": []}, {
                        "termId": 1311,
                        "name": "access token",
                        "children": []
                    }, {"termId": 1321, "name": "oauth token", "children": []}]
                }, {"termId": 1271, "name": "session", "children": []}, {
                    "termId": 1281,
                    "name": "credentials",
                    "children": []
                }, {"termId": 1291, "name": "oauth", "children": []}]
            }]
        }, {
            "termId": 71,
            "name": "encryption",
            "children": [{"termId": 281, "name": "base64", "children": []}, {
                "termId": 291,
                "name": "public key",
                "children": []
            }, {"termId": 301, "name": "secret key", "children": []}, {
                "termId": 311,
                "name": "sigchain",
                "children": []
            }]
        }]
    }
];


const maxData2 = [{
    "termId": 1,
    "name": "attack surfaces",
    "children": [{
        "termId": 11,
        "name": "language",
        "children": [{
            "termId": 81,
            "name": "programming language",
            "children": [{"termId": 321, "name": "python", "children": []}, {
                "termId": 331,
                "name": "javascript",
                "children": []
            }, {"termId": 341, "name": "coffeescript", "children": []}, {
                "termId": 351,
                "name": "css",
                "children": []
            }, {"termId": 361, "name": "php", "children": []}, {
                "termId": 371,
                "name": "java",
                "children": []
            }, {"termId": 381, "name": "asp", "children": []}]
        }, {
            "termId": 91,
            "name": "markup language",
            "children": [{"termId": 391, "name": "html", "children": []}, {
                "termId": 401,
                "name": "svg",
                "children": []
            }, {"termId": 411, "name": "xml", "children": []}, {"termId": 421, "name": "json", "children": []}]
        }, {
            "termId": 101,
            "name": "frameworks & libraries",
            "children": [{"termId": 431, "name": "angularjs", "children": []}, {
                "termId": 441,
                "name": "jquery",
                "children": []
            }, {"termId": 451, "name": "django", "children": []}, {
                "termId": 461,
                "name": "ajax",
                "children": []
            }, {"termId": 471, "name": "bootstrap", "children": []}]
        }]
    }, {
        "termId": 21,
        "name": "source code",
        "children": [{
            "termId": 111,
            "name": "source code resources",
            "children": [{"termId": 481, "name": "github", "children": []}, {
                "termId": 491,
                "name": "wayback machine",
                "children": []
            }, {"termId": 501, "name": "crawler", "children": []}]
        }, {
            "termId": 121,
            "name": "source code vulnerabilities",
            "children": [{"termId": 511, "name": "json stringify", "children": []}, {
                "termId": 521,
                "name": "broken html",
                "children": []
            }, {"termId": 531, "name": "canary protection", "children": []}, {
                "termId": 541,
                "name": "concatenation",
                "children": []
            }, {"termId": 551, "name": "dom", "children": []}, {
                "termId": 561,
                "name": "location property",
                "children": []
            }, {"termId": 571, "name": "unsanitized characters", "children": []}, {
                "termId": 581,
                "name": "validation",
                "children": []
            }, {"termId": 591, "name": "templating", "children": []}, {
                "termId": 601,
                "name": "configuration",
                "children": []
            }]
        }]
    }, {
        "termId": 31,
        "name": "user interface",
        "children": [{
            "termId": 171,
            "name": "website elements",
            "children": [{
                "termId": 611,
                "name": "upload",
                "children": [{"termId": 631, "name": "file upload", "children": []}, {
                    "termId": 641,
                    "name": "image upload",
                    "children": []
                }]
            }, {
                "termId": 621,
                "name": "text input",
                "children": [{"termId": 651, "name": "login", "children": []}, {
                    "termId": 661,
                    "name": "form",
                    "children": []
                }, {"termId": 671, "name": "search field", "children": []}, {
                    "termId": 681,
                    "name": "editor",
                    "children": []
                }]
            }]
        }, {
            "termId": 181,
            "name": "website functionality",
            "children": [{"termId": 691, "name": "account", "children": []}, {
                "termId": 701,
                "name": "payment",
                "children": []
            }, {"termId": 711, "name": "profile", "children": []}, {
                "termId": 721,
                "name": "membership",
                "children": []
            }, {"termId": 731, "name": "subscription", "children": []}]
        }]
    }, {
        "termId": 41,
        "name": "network & communication",
        "children": [{
            "termId": 131,
            "name": "request",
            "children": [{
                "termId": 741,
                "name": "url",
                "children": [{"termId": 821, "name": "path", "children": []}, {
                    "termId": 831,
                    "name": "deeplink",
                    "children": []
                }]
            }, {
                "termId": 751,
                "name": "parameter",
                "children": [{"termId": 841, "name": "http parameter", "children": []}, {
                    "termId": 851,
                    "name": "sid parameter",
                    "children": []
                }, {"termId": 861, "name": "single-character parameter", "children": []}, {
                    "termId": 871,
                    "name": "ssrf protection",
                    "children": []
                }, {"termId": 881, "name": "insecure direct object reference", "children": []}, {
                    "termId": 891,
                    "name": "csrf protection",
                    "children": []
                }]
            }, {
                "termId": 761,
                "name": "header",
                "children": [{"termId": 901, "name": "user-agent header", "children": []}, {
                    "termId": 911,
                    "name": "same-origin",
                    "children": []
                }, {"termId": 921, "name": "security header", "children": []}, {
                    "termId": 931,
                    "name": "cookie",
                    "children": []
                }, {"termId": 941, "name": "content security policy", "children": []}]
            }, {"termId": 771, "name": "post", "children": []}, {
                "termId": 781,
                "name": "get",
                "children": []
            }, {"termId": 791, "name": "put", "children": []}, {
                "termId": 801,
                "name": "delete",
                "children": []
            }, {"termId": 811, "name": "status codes", "children": []}]
        }, {
            "termId": 141,
            "name": "protocol",
            "children": [{"termId": 951, "name": "http", "children": []}, {
                "termId": 961,
                "name": "https",
                "children": []
            }]
        }, {
            "termId": 151,
            "name": "redirect",
            "children": [{"termId": 971, "name": "server redirect", "children": []}, {
                "termId": 981,
                "name": "client redirect",
                "children": []
            }]
        }, {
            "termId": 161,
            "name": "dns",
            "children": [{"termId": 991, "name": "cname", "children": []}, {
                "termId": 1001,
                "name": "fqdn",
                "children": []
            }, {"termId": 1011, "name": "subdomain", "children": []}, {
                "termId": 1021,
                "name": "web cache",
                "children": []
            }]
        }]
    }, {
        "termId": 51,
        "name": "server",
        "children": [{
            "termId": 191,
            "name": "cloud services",
            "children": [{"termId": 1031, "name": "azure", "children": []}, {
                "termId": 1041,
                "name": "amazon",
                "children": []
            }, {"termId": 1051, "name": "google cloud", "children": []}, {
                "termId": 1061,
                "name": "heroku",
                "children": []
            }]
        }, {
            "termId": 201,
            "name": "operating system",
            "children": [{"termId": 1071, "name": "linux", "children": []}, {
                "termId": 1081,
                "name": "windows nt",
                "children": []
            }, {"termId": 1091, "name": "windows", "children": []}, {"termId": 1101, "name": "osx", "children": []}]
        }, {
            "termId": 211,
            "name": "server software",
            "children": [{"termId": 1111, "name": "apache http server", "children": []}, {
                "termId": 1121,
                "name": "apache tomcat",
                "children": []
            }, {"termId": 1131, "name": "jetty", "children": []}, {
                "termId": 1141,
                "name": "nginx",
                "children": []
            }, {
                "termId": 1151,
                "name": "cms",
                "children": [{"termId": 1161, "name": "wordpress", "children": []}, {
                    "termId": 1171,
                    "name": "buddypress",
                    "children": []
                }]
            }]
        }, {
            "termId": 221,
            "name": "database",
            "children": [{"termId": 1181, "name": "mysql", "children": []}, {
                "termId": 1191,
                "name": "postgres",
                "children": []
            }]
        }, {
            "termId": 231,
            "name": "server techniques",
            "children": [{"termId": 1201, "name": "sandboxing", "children": []}, {
                "termId": 1211,
                "name": "virtual machine",
                "children": []
            }]
        }, {"termId": 241, "name": "port", "children": []}, {"termId": 251, "name": "host", "children": []}]
    }, {
        "termId": 61,
        "name": "account security",
        "children": [{
            "termId": 261,
            "name": "authorization",
            "children": [{"termId": 1221, "name": "privilege", "children": []}, {
                "termId": 1231,
                "name": "write-access",
                "children": []
            }, {"termId": 1241, "name": "administrator", "children": []}, {
                "termId": 1251,
                "name": "read-access",
                "children": []
            }]
        }, {
            "termId": 271,
            "name": "authentication",
            "children": [{
                "termId": 1261,
                "name": "token",
                "children": [{"termId": 1301, "name": "csrf token", "children": []}, {
                    "termId": 1311,
                    "name": "access token",
                    "children": []
                }, {"termId": 1321, "name": "oauth token", "children": []}]
            }, {"termId": 1271, "name": "session", "children": []}, {
                "termId": 1281,
                "name": "credentials",
                "children": []
            }, {"termId": 1291, "name": "oauth", "children": []}]
        }]
    }, {
        "termId": 71,
        "name": "encryption",
        "children": [{"termId": 281, "name": "base64", "children": []}, {
            "termId": 291,
            "name": "public key",
            "children": []
        }, {"termId": 301, "name": "secret key", "children": []}, {"termId": 311, "name": "sigchain", "children": []}]
    }]
}]

/**
 * Layout of rectangle formed nodes
 * @type {{shape: string, shapeProps: {width: number, height: number, x: number, y: number, rx: number, ry: number}}}
 */
const svgSquare = {
    shape: 'rect',
    shapeProps: {
        width: 160,
        height: 20,
        x: 0,
        y: -10,
        rx: 5,
        ry: 5
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

const separation = {
    siblings: 0.2,
    nonSiblings: 0.5
}




class Haxonomy extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            data: undefined,
            nodeData: undefined
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
    fetchTerms() {
        fetch(server + "/tree",
            {
                credentials: 'include',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then((response) => {
                if (response.error) throw new Error("Something went wrong. Please reload the page.");
                else return response;
            })
            .then(data => this.setState({data: data}))
            .then(() => console.log("THIS STATE DATA " + this.state.data))
            .catch(e => {
                alert(e.message);
            })
    }
/*
.then(data => {
    let l = this.state.data;
    l.push(data);
    this.setState({data: l})



                .then(res => console.log(res))

})*/

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

        return (
                <div id="treeWrapper" style={{marginLeft: '5em', width: '100em', height: '50em'}}>

                        <VerticallyCenteredModal
                            show={this.state.modalShow}
                            onHide={modalClose}
                            nodeData={this.state.nodeData}
                        />

                    <Tree styles={customStyles} data={this.state.data} orientation={'horizontal'} zoom={0.6} separation={separation} nodeSvgShape={svgSquare} textLayout={textLayout} collapsible={false} onClick={((nodeData, evt) => this.handleClick(nodeData, evt))}/>
                </div>
        );
    }
}
export default withRouter(Haxonomy);