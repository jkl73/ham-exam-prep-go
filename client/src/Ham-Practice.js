import React, { Component } from "react";
import axios from "axios";
import { Card, Label, Button, Accordion, Icon } from "semantic-ui-react";
import Box from '@material-ui/core/Box';
import HamNavList from "./Ham-Practice-Nav-List";

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

        this.navRef = React.createRef();

        this.state = {
            questionInfo: {
                stem:"Loading...",
                choices: ["...","...","...","..."],
                key: -1,
            },
            cardsColor: ["transparent","transparent","transparent","transparent"],            
            answerSelected: -1,
            activeIndex: -1
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

    getQuestion = (parapPayload) => {
        console.log(parapPayload)
        
        let param = ""

        if (parapPayload != undefined) {
            // create param for get quesiton request
            for (let i = 0; i < parapPayload.length; i++) {
                console.log(parapPayload[i])
                param = param + "chapter=" + parapPayload[i]
                if (i +1 < parapPayload.length) {
                    param += "&"
                }
            }
        }

        console.log(param)

        axios.get(endpoint + "/api/getq?" + param, {responseType:'arraybuffer'}).then(res => {
            if (res.data) {
                var question = qpb.Question.deserializeBinary(res.data)
                var distractorsl = question.getDistractorsList()

                // select random as key
                let keyloc = Math.floor(Math.random()*4)
                distractorsl.splice(keyloc,0, question.getKey())

                this.setState({
                    questionInfo: {
                        subl : question.getSubelement(),
                        group : question.getGroup(),
                        seq: question.getSequence(),
                        stem: question.getStem(),
                        choices: distractorsl,
                        key: keyloc,
                        figure: question.getFigure(),
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
            this.getQuestion(this.navRef.current.getSelectedGroups())
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

    handleAccordionClick = (e, titleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({activeIndex : newIndex})
    }

    render() {
        const activeIndex = this.state.activeIndex

        return (
            <div className="row">
                <Card.Group>
                    <Card color="yellow" fluid>
                        <Card.Content>
                            <Box style={{marginBottom: 20}}>
                                <Accordion styled fluid>
                                    <Accordion.Title
                                        active={activeIndex === 0}
                                        index={0}
                                        onClick={this.handleAccordionClick}
                                    >
                                        <Icon name='dropdown'/>
                                        Chapter Selection (next question are pulled randomly, might get a repeated one)
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0}>
                                        <HamNavList ref={this.navRef}/>
                                    </Accordion.Content>
                                </Accordion>
                            </Box>
                            <Card.Header textAlign="left">
                                <div style={{ fontSize: "15px", wordWrap: "break-word" }}>{this.state.questionInfo.subl} {this.state.questionInfo.group} {this.state.questionInfo.seq}</div>
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
                                </Card.Content>
                            </Card>

                            <Card fluid onClick={() => this.cardClicked(1)}>
                                <Card.Content style={{ background: this.state.cardsColor[1] }}>
                                    <Card.Header textAlign="left">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.questionInfo.choices[1]}</div>
                                    </Card.Header>                                       
                                </Card.Content>
                            </Card>

                            <Card fluid onClick={() => this.cardClicked(2)}>
                                <Card.Content style={{ background: this.state.cardsColor[2] }}>
                                    <Card.Header textAlign="left">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.questionInfo.choices[2]}</div>
                                    </Card.Header>
                                </Card.Content>
                            </Card>

                            <Card fluid onClick={() => this.cardClicked(3)}>
                            <Card.Content style={{ background: this.state.cardsColor[3] }}>
                                    <Card.Header textAlign="left">
                                        <div style={{ wordWrap: "break-word" }}>{this.state.questionInfo.choices[3]}</div>
                                    </Card.Header>
                                    <Card.Meta textAlign="right">
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                            <Card.Meta textAlign="right">
                            <Box  flex-direction="row-reverse">
                                <Button color='blue' onClick={() => this.backQuestion()}>Previous Question</Button>
                                <Button color='red' onClick={() => this.showAnswer()}>Don't Know</Button>
                                <Button color='green' onClick={() => this.checkAnswer()}>Confirm Answer</Button>
                                <Button color='blue' onClick={() => this.nextQuestion()}>Next Question</Button>
                            </Box>
                            </Card.Meta>
                        </Card.Content>    
                    </Card>
                </Card.Group>
            </div>
        );
    }
}

export default HamPractice