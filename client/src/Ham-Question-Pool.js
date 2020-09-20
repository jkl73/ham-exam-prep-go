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
            choices: "",
        };
    }

    componentDidMount() {
        console.log("componentDidMount")
        this.getQuestion()
    }

    // onChange = event => {
    //     this.setState
    // }


    // onSubmit = () => {
    //     let { s } = this.state
    // }

    getQuestion = () => {
        axios.get(endpoint + "/api/newq", {responseType:'arraybuffer'}).then(res => {
  

            if (res.data) {

                var qqq = qpb.Question.deserializeBinary(res.data)
                console.log(qqq)

                this.setState({
                    stem: qqq.getStem()
                });
                
                // this.setState({
                //     choices: res.data.map(choice => {
                //         let color = "yellow";
            
                //         if (choice.status) {
                //           color = "green";
                //         }
                //         return (
                //           <Card key={choice._id} color={color} fluid>
                //             <Card.Content>
                //               <Card.Header textAlign="left">
                //                 <div style={{ wordWrap: "break-word" }}>{choice.task}</div>
                //               </Card.Header>
            
                //               <Card.Meta textAlign="right">
                //                 <Icon
                //                   name="check circle"
                //                   color="green"
                //                 //   onClick={() => this.updateTask(item._id)}
                //                 />
                //                 <span style={{ paddingRight: 10 }}>Done</span>
                //                 <Icon
                //                   name="undo"
                //                   color="yellow"
                //                 //   onClick={() => this.undoTask(item._id)}
                //                 />
                //                 <span style={{ paddingRight: 10 }}>Undo</span>
                //                 <Icon
                //                   name="delete"
                //                   color="red"
                //                 //   onClick={() => this.deleteTask(item._id)}
                //                 />
                //                 <span style={{ paddingRight: 10 }}>Delete</span>
                //               </Card.Meta>
                //             </Card.Content>
                //           </Card>
                //         );
                //     })
                // });
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
                TO DO LIST
              </Header>
            </div>
            <div className="row">
              <Form onSubmit={this.onSubmit}>
                {/* <Input
                  type="text"
                  name="task"
                  onChange={this.onChange}
                  value={this.state.task}
                  fluid
                  placeholder="Create Task"
                />
                <Button >Create Task</Button> */}
              </Form>
            </div>
            <div className="row">
              <Card.Group>
                    <Card color="yellow" fluid>
                        <Card.Content>
                            <Card.Header textAlign="left">
                                <div style={{ wordWrap: "break-word" }}>{this.state.stem}</div>
                            </Card.Header>
                        </Card.Content>
                    </Card>
              </Card.Group>
            </div>
          </div>
        );
    }
}

export default HamQuestion