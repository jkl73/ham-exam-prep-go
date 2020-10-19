import React, { Component } from "react";
import axios from "axios";
import { Card, Label, Checkbox} from "semantic-ui-react";
import Box from '@material-ui/core/Box';

let endpoint = "http://192.168.0.82:8080";
let qpb = require('./ham-questions-pool_pb');

class HamNavList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            titlesL1:["..."],
            titles:["..."],
            selected:{},
            indeterminateSeleted:{}
        };
    }

    componentDidMount() {
        this.getTitles()
    }

    getTitles = () =>{
        axios.get(endpoint + "/api/gettitles", {responseType:'arraybuffer'}).then(res => {
            if (res.data) {
                let tt = qpb.AllTitles.deserializeBinary(res.data)
                tt = tt.getSubelementsList()
                this.setState({
                    titles: tt
                })

                // populate 
                this.populateCheckbox()
            }
        })
    };

    populateCheckbox = () => {
        let checks = {}
        let interminateChecks = {}
        for (let i = 0; i < this.state.titles.length; i++) {
            checks[this.state.titles[i].getId()] = false
            interminateChecks[this.state.titles[i].getId()] = false
            for (let j = 0; j < this.state.titles[i].getGroupsList().length; j++) {
                checks[this.state.titles[i].getId()+this.state.titles[i].getGroupsList()[j].getId()] = false
            }
        }
        this.setState({
            selected: checks,
            indeterminateSeleted: interminateChecks
        })
    }

    subelementChecked = (which) => {
        let x = this.state.selected
        let xIndeterminate = this.state.indeterminateSeleted
        x[which] = Boolean(true ^ x[which])
        xIndeterminate[which] = false

        for (let [key, value] of Object.entries(x)) {
            if (key.substring(0,2) == which) {
                x[key] = x[which]
            }
        }
        
        this.setState({
            selected: x,
            indeterminateSeleted: xIndeterminate
        })
    }

    groupChecked = (which) => {
        let x = this.state.selected
        let xIndeterminate = this.state.indeterminateSeleted
        x[which] = Boolean(true ^ x[which])
        this.setState({
            selected: x
        })

        let allselect = true
        let anyselect = false
        for (let [key, value] of Object.entries(x)) {
            if (key.length > 2 && key.substring(0,2) == which.substring(0,2)) {
                allselect = Boolean(allselect && value) 
                anyselect = Boolean(anyselect || value)
            }
        }

        if (allselect) {
            x[which.substring(0, 2)] = true
            xIndeterminate[which.substring(0, 2)] = false
        } else if (anyselect) {
            x[which.substring(0, 2)] = false
            xIndeterminate[which.substring(0, 2)] = true
        } else {
            x[which.substring(0, 2)] = false
            xIndeterminate[which.substring(0, 2)] = false
        }

        this.setState({
            selected: x,
            indeterminateSeleted: xIndeterminate
        })
    }

    getSelectedGroups = () => {
        let res = []
        for (let [key, value] of Object.entries(this.state.selected)) {
            if (key.length > 2 && value) {
                res.push(key)
            }
        }
        return res
    }

    renderManual = () => {
        let res = ""
        if (this.state.titles.length <= 2) {
            return (<Box>loading</Box>)
        }
        const titles = this.state.titles.map((v, index) => {
            return <Box key={v.getId()}><Checkbox indeterminate={this.state.indeterminateSeleted[v.getId()]} checked={this.state.selected[v.getId()]} onChange={() => this.subelementChecked(v.getId())} label={v.getId()+" - "+v.getTitle()} />  { v.getGroupsList().map((gv, index) => 
                <Box key={gv.getId()} style={{ paddingLeft: 20}}><Checkbox checked={this.state.selected[v.getId()+gv.getId()]} onChange={() => this.groupChecked(v.getId()+gv.getId())} label={gv.getId()+". "+gv.getTitle()} /></Box>
            )} </Box>
        })
        return (<Box>{titles}</Box>)
    }

    render() {
        return (
            <Box>
                {this.renderManual()}
            </Box>
        )
    }
}

export default HamNavList