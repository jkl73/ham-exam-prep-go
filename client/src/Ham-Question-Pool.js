import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";


let endpoint = "http://192.168.0.82:8080";

let qpb = require('./ham-questions-pool_pb')

class HamQuestion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            stem: "",
            choices: [],
            cardsColor: ["grey","grey","grey","grey"],
        };
    }

    componentDidMount() {
        console.log("componentDidMount")
        this.getQuestion()
    }

    cardClicked = (which) => {
        this.setState({
            cardsColor: ["green","grey","grey","grey"],
        });
    };

    getQuestion = () => {
        axios.get(endpoint + "/api/newq", {responseType:'arraybuffer'}).then(res => {
  

            if (res.data) {

                var qqq = qpb.Question.deserializeBinary(res.data)
                console.log(qqq)

                
                console.log(qqq.getDistractorsList())
                var distractorsl = qqq.getDistractorsList()
                console.log(qqq.getStem())
                console.log(qqq.getKey())

                // select random
                let keyloc = Math.floor(Math.random()*4)
                distractorsl.splice(keyloc,0, qqq.getKey())
                console.log(keyloc)

                this.setState({
                    stem: qqq.getStem(),
                    choices: distractorsl,
                });
            } else {
                this.setState({
                    stem: "nono"
                });
            }
        });
    };

    render() {
        return (
          <div>
            <div className="row">
              <Header className="header" as="h2">
                HAM General Exam Questions Pool
              </Header>
            </div>
            <div className="row">
                <Card.Group>
                    <Card color="yellow" fluid>
                        <Card.Content>
                            <Card.Header textAlign="center">
                                <div style={{ wordWrap: "break-word" }}>{this.state.stem}</div>
                            </Card.Header>
                            <Card color={this.state.cardsColor[0]} fluid onClick={() => this.cardClicked(0)}>
                                <Card.Content style={{ background: this.state.cardsColor[0] }}>
                                    <Card.Header textAlign="center">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.choices[0]}</div>
                                    </Card.Header>
                                    <Card.Meta textAlign="right">
                                        {/* <Icon
                                          name="delete"
                                          color="red"
                                          onClick={() => this.deleteTask(item._id)}
                                        /> */}
                                        {/* <span style={{ paddingRight: 10 }}>Delete</span> */}
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                            <Card color="grey" fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.choices[1]}</div>
                                    </Card.Header>
                                    <Card.Meta textAlign="right">
                                        {/* <Icon
                                          name="delete"
                                          color="red"
                                          onClick={() => this.deleteTask(item._id)}
                                        />
                                        <span style={{ paddingRight: 10 }}>Delete</span> */}
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                            <Card color="grey" fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.choices[2]}</div>
                                    </Card.Header>
                                    <Card.Meta textAlign="right">
                                        {/* <Icon
                                          name="delete"
                                          color="red"
                                          onClick={() => this.deleteTask(item._id)}
                                        /> */}
                                        {/* <span stylse={{ paddingRight: 10 }}>Delete</span> */}
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                            <Card color="grey" fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.choices[3]}</div>
                                    </Card.Header>
                                    <Card.Meta textAlign="right">
                                        {/* <Icon
                                          name="delete"
                                          color="red"
                                          onClick={() => this.deleteTask(item._id)}
                                        /> */}
                                        {/* <span style={{ paddingRight: 10 }}>Delete</span> */}
                                    </Card.Meta>
                                </Card.Content>
                            </Card>


                            <Card.Meta textAlign="right">     
                                <Icon
                                  name="delete"
                                  color="red"
                                  // onClick={() => this.deleteTask(item._id)}
                                />
                                <span style={{ paddingRight: 10 }}>Delete</span>
                            </Card.Meta>
                        </Card.Content>    
                    </Card>
                </Card.Group>
            </div>
          </div>
        );
    }
}

export default HamQuestion