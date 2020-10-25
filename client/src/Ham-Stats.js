import Box from '@material-ui/core/Box';
import axios from "axios";
import React, { Component } from "react";
import { Card , Icon, Progress, Button } from "semantic-ui-react";

let endpoint = "http://192.168.0.82:8080";
let qpb = require('./ham-questions-pool_pb');

class HamStats extends Component {
    constructor(props){
        super(props);

        this.state = {
            allstats: [],
            zeroAccu: 0,
            oneAccu: 0,
            midAccu: 0,
        }
    }

    componentDidMount() {

        axios.get(endpoint + "/api/getstats", {responseType:'arraybuffer'}).then(res => {
            let allRight = 0
            let allWrong = 0
            let mixed = 0
    
            // let examliststate = []
            if (res.data) {
                var mystats = qpb.PersonalStat.deserializeBinary(res.data)
                var statslist = []

                mystats.getStatsmapMap().forEach((v,k)=>{
                    var statstuple = []
                    k = k.length < 5 ? k.substring(0,3) + "0" + k.substring(3,4) : k 
                    statstuple.push(k)
                    statstuple.push(v)
                    statslist.push(statstuple)

                    if (v.getCorrect() == 0) {
                        allWrong++
                    } else if (v.getWrong() == 0){
                        allRight++
                    } else {
                        mixed++
                    }
                })
                statslist.sort((a,b)=> a[0].localeCompare(b[0]))
            } 
            // init state
            this.setState({
                allstats: statslist,
                zeroAccu: allWrong,
                oneAccu: allRight,
                midAccu: mixed,
            })
        });
    }

    sortstatsAccu = () => {
        let statslist = this.state.allstats
        statslist.sort((a,b)=> (a[1].getCorrect()/(a[1].getUnknown() + a[1].getWrong() + a[1].getCorrect()))
                              - b[1].getCorrect()/(b[1].getUnknown() + b[1].getWrong() + b[1].getCorrect()))
        this.setState({
            allstats: statslist
        })
    }

    sortstatsName = () => {
        let statslist = this.state.allstats
        statslist.sort((a,b)=> a[0].localeCompare(b[0]))
        this.setState({
            allstats: statslist
        })
    }

    render() {
        return (
            <Card.Group>
                <Card color="yellow" fluid>
                    <Card.Content >
                        <Button onClick={() => this.sortstatsAccu()}>Sort Accuracy</Button>
                        <Button onClick={() => this.sortstatsName()}>Sort Name</Button>
                            Total: 454 | All Correct: {this.state.oneAccu} | All Wrong: {this.state.zeroAccu} | Mixed: {this.state.midAccu}
                    </Card.Content>
                    
                    {this.state.allstats.map((v, index) => 
                        <Card.Content key={index} >
                            <Box display='flex'>
                            <Box width="200px">
                                {v[0]} [<b>{v[1].getCorrect() + v[1].getUnknown() + v[1].getWrong()}</b>] (✔️: {v[1].getCorrect()}, ❓: {v[1].getUnknown()}, ❌: {v[1].getWrong()})
                            </Box>
                            <Box display='flex' style={{ justifyContent: 'center', alignItems: 'center'}} flexGrow={1}>
                                <Progress  style={{ margin: "0px", width: "100%"}}  size='tiny' percent={(v[1].getCorrect()/(v[1].getUnknown() + v[1].getWrong() + v[1].getCorrect())) * 100}>
                            </Progress>
                            </Box>
                            </Box>
                        </Card.Content>
                    )}
              </Card>
          </Card.Group>
        )
    }
}

export default HamStats
