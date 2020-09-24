import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";


let endpoint = "http://192.168.0.82:8080";

let qpb = require('./ham-questions-pool_pb');

let palegreen = "rgb(190,251,152)";
let bluuu = "rgba(135,200,230,12)";
let reddd = "rgb(240,128,128)";

class HamQuestion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            stem: "",
            choices: [],
            key: -1,
            cardsColor: ["transparent","transparent","transparent","transparent"],
            answerSelected: -1,
        };
    }

    componentDidMount() {
        this.getQuestion()
    }

    cardClicked = (which) => {
        let colrs = ["transparent","transparent","transparent","transparent"];
        colrs[which] = bluuu
        
        this.setState({
            cardsColor: colrs,
            answerSelected: which
        });
    };

    showAnswer = () => {
        let colrs = ["transparent","transparent","transparent","transparent"];
        colrs[this.state.key] = palegreen

        this.setState({
            cardsColor: colrs,
        });
    }

    checkAnswer = () => {
        let colrs = this.state.cardsColor


        if (this.state.answerSelected == this.state.key) {
            colrs[this.state.key] = palegreen
        } else {
            colrs[this.state.answerSelected ] = reddd
            colrs[this.state.key] = palegreen
        }


        this.setState({
            cardsColor: colrs,
        });
    }

    getQuestion = () => {
        axios.get(endpoint + "/api/newq", {responseType:'arraybuffer'}).then(res => {
            if (res.data) {
                var qqq = qpb.Question.deserializeBinary(res.data)
                var distractorsl = qqq.getDistractorsList()

                // select random as key
                let keyloc = Math.floor(Math.random()*4)
                distractorsl.splice(keyloc,0, qqq.getKey())

                this.setState({
                    stem: qqq.getStem(),
                    choices: distractorsl,
                    key: keyloc
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
                HAM General Exam Practice 📻
              </Header>
            </div>
            <div className="row">
                <Card.Group>
                    <Card color="yellow" fluid>
                        <Card.Content>
                            <Card.Header textAlign="center">
                                <div style={{ fontSize: "20px", wordWrap: "break-word" }}>{this.state.stem}</div>
                            </Card.Header>
                            <Card fluid onClick={() => this.cardClicked(0)}>
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

                            <Card fluid onClick={() => this.cardClicked(1)}>
                                <Card.Content style={{ background: this.state.cardsColor[1] }}>
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

                            <Card fluid onClick={() => this.cardClicked(2)}>
                            <Card.Content style={{ background: this.state.cardsColor[2] }}>
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

                            <Card fluid onClick={() => this.cardClicked(3)}>
                            <Card.Content style={{ background: this.state.cardsColor[3] }}>
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
                            <div className="ui buttons">
                                <div className="ui red basic button" onClick={() => this.showAnswer()}>Don't Know</div>
                                <div className="ui green basic button" onClick={() => this.checkAnswer()}>Confirm Answer</div>
                                <div className="ui blue basic button">Next Question</div>
                            </div>
                            </Card.Meta>
                            
                            {/* <Card.Meta textAlign="right">     
                                <Icon
                                  name="delete"
                                  color="red"
                                  // onClick={() => this.deleteTask(item._id)}
                                />
                                <span style={{ paddingRight: 10 }}>Delete</span>
                            </Card.Meta> */}
                        </Card.Content>    
                    </Card>
                </Card.Group>
            </div>
          </div>
        );
    }
}

export default HamQuestion