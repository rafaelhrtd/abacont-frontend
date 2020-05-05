import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import Aux from '../../../hoc/Aux/Aux'
import NewContact from './NewContact/NewContact'
import Contact from './Contact/Contact';

class Contacts extends Component {
    state = {
        category: this.props.clients ? "client" : "provider"
    }
    render(){
        const title = (this.state.category == "client" ? "Clientes" : "Proveedores");
        return (
            <Aux>
                <Switch>
                    <Route path={this.props.match.url + "/"} exact render={() => (
                        <h1>{title}</h1>
                    )} />
                    <Route path={this.props.match.url + "/agregar"} exact render={() => (
                        <NewContact category={this.state.category} />
                    )} />
                    <Route path={this.props.match.url + "/:id"} exact render={() => (
                        <Contact />
                    )} />
                </Switch>
            </Aux>
        )
    }
}

export default withRouter(Contacts)