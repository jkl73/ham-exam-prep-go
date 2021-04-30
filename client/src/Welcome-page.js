import React, { Component } from "react";
import Box from '@material-ui/core/Box';
import { CardContent, Container, Divider, Grid, Header, Icon } from "semantic-ui-react"
import { Card, CardActions, CardActionArea, Typography } from "@material-ui/core";
// import { BrowserRotuer as Router, Switch, Route, Link} from "react-router-dom";


class WelcomePage extends Component {
    render() {
        return (
            <Container>
                <style>
                    {`
                    html, body {
                        background-color: #252839
                    }

                    p {
                        align-content: center;
                        background-color: #495285;
                        color: #fff;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        min-height: 6em;
                    }
                    `
                    }
                </style>

                <Header as='h2' icon inverted textAlign='center'>
                    HAM Radio Exam Practice
                </Header>
                <Grid columns={3} divided textAlign='center'>
                    <Grid.Column>
                        <CardActionArea>
                            <a href="tech">
                                <Card>
                                    <CardContent>
                                        <Typography>
                                            Technician
                                        </Typography>
                                        <Typography>
                                            July 1, 2018 - Jun 30, 2022
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </a>
                        </CardActionArea>
                    </Grid.Column>
                    <Grid.Column>
                        <CardActionArea>
                            <a href="general">
                                <Card>
                                    <CardContent>
                                        <Typography>
                                            General
                                        </Typography>
                                        <Typography>
                                            July 1, 2019 - Jun 30, 2023
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </a>
                        </CardActionArea>
                    </Grid.Column>
                    <Grid.Column>
                        <CardActionArea>
                            <a href="extra">
                                <Card>
                                    <CardContent>
                                        <Typography>
                                            Amateur Extra
                                        </Typography>
                                        <Typography>
                                            July 1, 2020 - Jun 30, 2024
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </a>
                        </CardActionArea>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

export default WelcomePage