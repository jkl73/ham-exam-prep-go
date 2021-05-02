import React, { Component, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";
import { AppBar } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HamPractice from './Ham-Practice';
import HamExamEmu from './Ham-Exam-Emu';
import HamStats from './Ham-Stats';
import { baseURL } from "./api-config"

let endpoint = baseURL;
let qpb = require('./ham-questions-pool_pb');

let palegreen = "rgb(190,251,152)";
let bluuu = "rgba(135,200,230,12)";
let reddd = "rgb(240,128,128)";

let lv;
let leveltitle;
let appbarcolor;

// back button
let backstack = [];
let frontstack = [];

class TabPanel extends React.Component {
    
    render() {
      return (
        <div
            role="tabpanel"
            hidden={this.props.value !== this.props.index}
            id={`simple-tabpanel-${this.props.index}`}
            aria-labelledby={`simple-tab-${this.props.index}`}
            {...this.props.other}
        >
            {/* {this.props.value === this.props.index && (
            <Box p={0}>
                {this.props.children}
            </Box>
            )} */}
            {this.props.children}
        </div>
      )
    }
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


class HamQuestion extends Component {
    constructor(props) {
        super(props);
        lv = props.level

        if (lv == "T") {
          leveltitle = "Technician"
          appbarcolor = "#0bbf3b"
        } else if (lv == "G") {
          leveltitle = "General"
          appbarcolor = "#3b36f7"
        } else if (lv == "E") {
          leveltitle = "Amateur Extra"
          appbarcolor = "#De3f43"
        }

        this.state = {
            tabValue: 0,
        };
    }

    componentDidMount() {
    }

    handleTabChange = (event, newValue) => {
        this.setState({
            tabValue: newValue
        })
    };

    render() {
        const appbarstype = {
          background: appbarcolor
        }

        return (
          <div>
            <div className="row">
              <Header style={{ margin: "25px 10px" }} className="header" as="h1">
                HAM {leveltitle} Exam Practice 📻
              </Header>
            </div>
            <AppBar position="static" style={appbarstype}>
                <Tabs value={this.state.tabValue} onChange={this.handleTabChange} aria-label="simple tabs example">
                  <Tab label="Practice"/>
                  <Tab label="Exam Emulator"/>
                  <Tab label="Stats"/>  
                </Tabs>
            </AppBar>

            <TabPanel value={this.state.tabValue} index={0}>
              <HamPractice level={lv}></HamPractice>
            </TabPanel>
            
            <TabPanel value={this.state.tabValue} index={1}>
              <HamExamEmu level={lv}></HamExamEmu>
            </TabPanel>

            <TabPanel value={this.state.tabValue} index={2}>
              <HamStats level={lv}></HamStats>
            </TabPanel>
          </div>
        );
    }
}

export default HamQuestion