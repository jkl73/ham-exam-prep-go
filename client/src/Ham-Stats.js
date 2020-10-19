import Box from '@material-ui/core/Box';
import axios from "axios";
import React, { Component } from "react";
import { Card , Icon, Progress } from "semantic-ui-react";

let endpoint = "http://192.168.0.82:8080";
let qpb = require('./ham-questions-pool_pb');

class HamStats extends Component {
    constructor(props){
        super(props);

        this.state = {
            allstats: []
        }
    }

    componentDidMount() {
        axios.get(endpoint + "/api/getstats", {responseType:'arraybuffer'}).then(res => {
            // let examliststate = []
            if (res.data) {
                var mystats = qpb.PersonalStat.deserializeBinary(res.data)
                var statslist = []

                mystats.getStatsmapMap().forEach((v,k)=>{
                    var statstuple = []
                    statstuple.push(k)
                    statstuple.push(v)
                    statslist.push(statstuple)
                })
                statslist.sort((a,b)=> (b[0] - a[0]))
                // statslist.sort((a,b)=> (a[1].getCorrect()/(a[1].getUnknown() + a[1].getWrong() + a[1].getCorrect()))
                //                         - b[1].getCorrect()/(b[1].getUnknown() + b[1].getWrong() + b[1].getCorrect()))
            } 
            // init state
            this.setState({
                allstats: statslist
            })
        });
    }

    render() {
        return (
            <Card.Group>
                <Card color="yellow" fluid>
                    {this.state.allstats.map((v, index) => 
                        <Card.Content key={index}>
                           <Progress size='tiny' percent={(v[1].getCorrect()/(v[1].getUnknown() + v[1].getWrong() + v[1].getCorrect())) * 100} Active>
                                {v[0]} (Correct: {v[1].getCorrect()}, Unknown: {v[1].getUnknown()}, Wrong: {v[1].getWrong()})
                            </Progress>
                        </Card.Content>
                    )}
              </Card>
          </Card.Group>
        )
    }
}

export default HamStats
