import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import Aux from '../../../hoc/Aux/Aux'
import NewProject from './NewProject/NewProject'
import Project from './Project/Project'
import ProjectIndex from './ProjectIndex/ProjectIndex'

class Contacts extends Component {
    render(){
        return (
            <Aux>
                <Switch>
                    <Route path={this.props.match.url + "/"} exact render={() => (
                        <ProjectIndex />
                    )} />
                    <Route path={this.props.match.url + "/agregar"} exact render={() => (
                        <NewProject />
                    )} />
                    <Route path={this.props.match.url + "/:id"} render={() => (
                        <Project />
                    )} />
                </Switch>
            </Aux>
        )
    }
}

export default withRouter(Contacts)