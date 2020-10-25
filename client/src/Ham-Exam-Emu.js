import React, { Component } from "react";
import axios from "axios";
import { Card , Icon, Checkbox } from "semantic-ui-react";
import Box from '@material-ui/core/Box';

let endpoint = "http://192.168.0.82:8080";
let qpb = require('./ham-questions-pool_pb');

let palegreen = "rgb(190,251,152)";
let bluuu = "rgba(135,200,230,12)";
let reddd = "rgb(240,128,128)";

class HamExamEmu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionsInfoAndState: [], // all questions context
            questionInfo: {
                stem:"Loading...",
                choices: ["...","...","...","..."],
                key: -1,
                cardsColor: ["transparent","transparent","transparent","transparent"],            
                answerSelected: -2,
            }, // current displaying questions
            currentShowingQuestion: -1,
            displaymode: 0, // 0 answering, 1 submitted
            correctCount: 0,
            prioWrong: false,
        };
    }

    componentDidMount() {
        this.getExamQuestions()
    }

    cardClicked = (which) => {
        // if is in submitted mode then click won't have effect
        if (this.state.displaymode == 1){
            return
        }

        let colrs = ["transparent","transparent","transparent","transparent"];
        colrs[which] = bluuu;
        this.state.questionInfo.cardsColor = colrs
        this.state.questionsInfoAndState[this.state.currentShowingQuestion].questionInfo.answerSelected = which
        this.setState({
            cardsColor: colrs,
        })
    };

    newExam = () => {
        this.getExamQuestions()

        this.setState({
            displaymode: 0,
            correctCount: 0
        })
    }

    radioCircleClicked = (which) =>{
        this.setState({
            currentShowingQuestion: which,
            questionInfo: this.state.questionsInfoAndState[which].questionInfo,
            cardsColor: this.state.questionsInfoAndState[which].questionInfo.cardsColor,
        })
    }

    submitCurrentAnswer = () => {
        let correct = 0
        var statmsgs = new qpb.StatMsgs()
        
        // set card colors
        for (let i = 0; i < this.state.questionsInfoAndState.length; i++) {
            let cur = this.state.questionsInfoAndState[i].questionInfo
            var statmsg = new qpb.StatMsg()

            statmsg.setSubelement(cur.subl)
            statmsg.setGroup(cur.group)
            statmsg.setSequence(cur.seq)

            if (cur.answerSelected >= 0 && cur.answerSelected <= 3) {
                if (cur.answerSelected == cur.key) {
                    statmsg.setVerdict(qpb.StatsVerdict.STAT_CORRECT)
                    correct++
                } else {
                    statmsg.setVerdict(qpb.StatsVerdict.STAT_WRONG)
                    cur.cardsColor[cur.answerSelected] = reddd
                }
            } else {
                statmsg.setVerdict(qpb.StatsVerdict.STAT_UNKNOWN)
            }
            cur.cardsColor[cur.key] = palegreen

            statmsgs.addMsgs(statmsg)
        }

        // send stat back
        axios.post(endpoint + "/api/savestatsbatch", statmsgs.serializeBinary(),
            { 
                responseType: 'arraybuffer',
                headers: {'Content-Type': 'application/octet-stream'}
            }).then(function (response) {
            }).catch(function (response) {
            })
        this.setState({
            displaymode: 1,
            correctCount: correct
        })
    }

    getExamQuestions = () => {
        let param = ""
        param += this.state.prioWrong ? "prioWrong=1&" : ""

        axios.get(endpoint + "/api/exam?" + param, {responseType:'arraybuffer'}).then(res => {
            let examliststate = []
            if (res.data) {
                var examQuestionsList = qpb.QuestionList.deserializeBinary(res.data)

                let examqlist = examQuestionsList.getQuestionsList()

                for (let i = 0; i < examqlist.length; i++) {
                    // select random as key
                    var distractorsl = examqlist[i].getDistractorsList()
                    let keyloc = Math.floor(Math.random()*4)
                    distractorsl.splice(keyloc,0, examqlist[i].getKey())

                    examliststate.push({questionInfo: {
                            subl : examqlist[i].getSubelement(),
                            group : examqlist[i].getGroup(),
                            seq: examqlist[i].getSequence(),
                            stem: examqlist[i].getStem(),
                            figure: examqlist[i].getFigure(),
                            choices: distractorsl,
                            key: keyloc,
                            cardsColor: ["transparent","transparent","transparent","transparent"],
                            answerSelected: -1,
                        },
                    })
                }
            } else {
                this.setState({
                    stem: "nono"
                });
            }
            // init state
            this.setState({
                questionsInfoAndState: examliststate,
                questionInfo: examliststate[0].questionInfo,
                currentShowingQuestion: 0
            })
        });
    };

    backQuestion = () => {
        let newindex = this.state.currentShowingQuestion-1
        if (newindex < 0) {
            newindex = this.state.questionsInfoAndState.length - 1
        }
        this.setState({
            currentShowingQuestion: newindex,
            questionInfo: this.state.questionsInfoAndState[newindex].questionInfo,
            cardsColor: this.state.questionsInfoAndState[newindex].questionInfo.cardsColor,
        })
    };

    nextQuestion = () => {
        let newindex = this.state.currentShowingQuestion+1
        if (newindex >= this.state.questionsInfoAndState.length) {
            newindex = 0
        }
        this.setState({
            currentShowingQuestion: newindex,
            questionInfo: this.state.questionsInfoAndState[newindex].questionInfo,
            cardsColor: this.state.questionsInfoAndState[newindex].questionInfo.cardsColor,
        })
    };

    handlePrioCheckBox = (e, {checked}) => {
        this.setState({prioWrong: checked})
    }

    render() {
        return (
            <div className="row">
                <Card.Group>
                    <Card color="yellow" fluid>
                        <Card.Content> 
                            <Card.Meta >
                                <Box  style={{margin: "0px"}} display="flex" >
                                    <Box display="flex" flexWrap="wrap">
                                        {this.state.questionsInfoAndState.map((value, index) => {
                                            return (
                                            <Box key={index} onClick={() => this.radioCircleClicked(index)} >
                                                {this.state.displaymode == 0
                                                    // answering mode
                                                    ? this.state.currentShowingQuestion == index
                                                        ?  this.state.questionsInfoAndState[index].questionInfo.answerSelected >= 0 
                                                            ? <Icon name='dot circle' color='blue'/>
                                                            : <Icon name='dot circle' />
                                                        :  this.state.questionsInfoAndState[index].questionInfo.answerSelected >= 0
                                                            ? <Icon name='circle' color='blue'/>
                                                            : <Icon name='circle outline'/>
                                                    // submitted mode        
                                                    : this.state.currentShowingQuestion == index
                                                        ? this.state.questionsInfoAndState[index].questionInfo.answerSelected == this.state.questionsInfoAndState[index].questionInfo.key 
                                                            ? <Icon name='dot circle' color='green' />
                                                            : <Icon name='dot circle' color='red' />
                                                        : this.state.questionsInfoAndState[index].questionInfo.answerSelected == this.state.questionsInfoAndState[index].questionInfo.key 
                                                            ? <Icon name='circle' color='green' />
                                                            : <Icon name='circle' color='red' />
                                                }
                                            </Box>
                                            )
                                        })}
                                        {this.state.displaymode == 1 && <Box>Score: {this.state.correctCount}/{this.state.questionsInfoAndState.length} (Min Passing Score: 26/35)</Box>}
                                    </Box>
                                    <Box flexBasis="30em" textAlign="right">
                                        <Box flexDirection="row">
                                            {this.state.currentShowingQuestion + 1}/{this.state.questionsInfoAndState.length}
                                        </Box>
                                        <Box flexDirection="row" className="ui buttons">
                                            <div className="ui orange basic button" onClick={() => this.submitCurrentAnswer()}>Submit</div>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box style={{marginTop: "10px"}} textAlign="right" >
                                    <Checkbox style={{marginRight: "15px"}}  onChange={this.handlePrioCheckBox} label='Prioritize Wrong' />
                                    <div className="ui green basic button" onClick={() => this.newExam()}>New Exam</div>
                                </Box>
                            </Card.Meta>

                            <Card.Header textAlign="left">
                                <div style={{ fontSize: "15px", wordWrap: "break-word" }}>{this.state.questionInfo.subl}{this.state.questionInfo.group}{this.state.questionInfo.seq}</div>
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
                                <Card.Content style={{ background: this.state.questionInfo.cardsColor[0] }}>
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
                                <Card.Content style={{ background: this.state.questionInfo.cardsColor[1] }}>
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
                            <Card.Content style={{ background: this.state.questionInfo.cardsColor[2] }}>
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
                            <Card.Content style={{ background: this.state.questionInfo.cardsColor[3] }}>
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
                                <div className="ui blue basic button" onClick={() => this.backQuestion()}>Previous Question</div>
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

export default HamExamEmu