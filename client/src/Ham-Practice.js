import React, { Component } from "react";
import axios from "axios";
import { Card } from "semantic-ui-react";
import Box from '@material-ui/core/Box';


let endpoint = "http://192.168.0.82:8080";
let qpb = require('./ham-questions-pool_pb');

let palegreen = "rgb(190,251,152)";
let bluuu = "rgba(135,200,230,12)";
let reddd = "rgb(240,128,128)";

// back button
let backstack = [];
let frontstack = [];

class HamPractice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionInfo: {
                stem:"Loading...",
                choices: ["...","...","...","..."],
                key: -1,
            },
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
        colrs[this.state.questionInfo.key] = palegreen

        this.setState({
            cardsColor: colrs,
        });
    }

    checkAnswer = () => {
        let colrs = this.state.cardsColor

        if (this.state.answerSelected == this.state.questionInfo.key) {
            colrs[this.state.questionInfo.key] = palegreen
        } else {
            colrs[this.state.answerSelected ] = reddd
            colrs[this.state.questionInfo.key] = palegreen
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
                    questionInfo: {
                        subl : qqq.getSublement(),
                        section : qqq.getSection(),
                        seq: qqq.getSequence(),
                        stem: qqq.getStem(),
                        choices: distractorsl,
                        key: keyloc,
                        figure: qqq.getFigure(),
                    },
                    cardsColor: ["transparent","transparent","transparent","transparent"],
                    answerSelected: -1,
                });
            } else {
                this.setState({
                    stem: "nono"
                });
            }
        });
    };

    backQuestion = () => {
        if (backstack.length > 0) {
            frontstack.push(this.state.questionInfo)
            let poped = backstack.pop()
            this.setState({
                questionInfo: poped,
                cardsColor: ["transparent","transparent","transparent","transparent"],
                answerSelected: -1,
            })
        }
    };

    nextQuestion = () => {
        if (frontstack.length <= 0) {
            this.getQuestion()
            backstack.push(this.state.questionInfo)
        } else {
            let poped = frontstack.pop()
            this.setState({
                questionInfo: poped,
                cardsColor: ["transparent","transparent","transparent","transparent"],
                answerSelected: -1,
            })
            backstack.push(this.state.questionInfo)
        }
    };

    handleTabChange = (event, newValue) => {
        this.setState({
            tabValue: newValue
        })
    };

    render() {
        return (
            <div className="row">
                <Card.Group>
                    <Card color="yellow" fluid>
                        <Card.Content>
                            <Card.Header textAlign="left">
                                <div style={{ fontSize: "15px", wordWrap: "break-word" }}>{this.state.questionInfo.subl} {this.state.questionInfo.section} {this.state.questionInfo.seq}</div>
                                <div style={{ fontSize: "20px", wordWrap: "break-word" }}>{this.state.questionInfo.stem}</div>
                            </Card.Header>
                            
                            {this.state.questionInfo.figure == "2019-2023_general-G7-1.png" &&
                            <Box>    
                                <img style={{ maxWidth: "100%" }}
                                src="http://192.168.0.82:8080/image"
                                alt="Schematic diagram for this question"
                                />
                            </Box>
                            }

                            <Card fluid onClick={() => this.cardClicked(0)}>
                                <Card.Content style={{ background: this.state.cardsColor[0] }}>
                                    <Card.Header textAlign="left">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.questionInfo.choices[0]}</div>
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
                                    <Card.Header textAlign="left">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.questionInfo.choices[1]}</div>
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
                                    <Card.Header textAlign="left">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.questionInfo.choices[2]}</div>
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
                                    <Card.Header textAlign="left">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.questionInfo.choices[3]}</div>
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
                                <div className="ui blue basic button" onClick={() => this.backQuestion()} >Previous Questions</div>
                                <div className="ui red basic button" onClick={() => this.showAnswer()}>Don't Know</div>
                                <div className="ui green basic button" onClick={() => this.checkAnswer()}>Confirm Answer</div>
                                <div className="ui blue basic button" onClick={() => this.nextQuestion()}>Next Question</div>
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
        );
    }
}

export default HamPractice