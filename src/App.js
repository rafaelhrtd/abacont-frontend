import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Aux from './hoc/Aux/Aux'
import Contacts from './components/containers/Contacts/Contacts';
import Transactions from './components/containers/Transactions/Transactions'
import classes from './App.css'
import Projects from './components/containers/Projects/Projects'
import Axios from 'axios'
class App extends Component {
  state = {
    email: null,
    password: null,
    redirect: null
  }
  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }


    Axios.interceptors.response.use(
      response => response,
      error => {
          const {status} = error.response;
          if (status === 403) {
            // put what to do here
            // should show a warning
            this.setState({redirect: "/transacciones/"})
          }
          return Promise.reject(error);
      }

  )
    return (
      <div className={classes.App}>
        <Route path="/" exact render={() => (
          <h1>Home</h1>
        )} />
        <Route path="/clientes" render={() => (
          <Contacts clients={true} providers={false} />
        )} />
        <Route path="/proveedores" render={() => (
          <Contacts providers={true} clients={false} />
        )} />
        <Route path="/transacciones" exact render={() => (
          <Transactions />
        )} />
        <Route path="/cuentas-por-cobrar" render={() => (
          <Transactions category="receivable" />
        )} />
        <Route path="/cuentas-por-pagar" render={() => (
          <Transactions category="payable" />
        )} />
        <Route path="/egresos" render={() => (
          <Transactions category="expense" />
        )} />
        <Route path="/ingresos" render={() => (
          <Transactions category="revenue" />
        )} />
        <Route path="/proyectos" render={() => (
          <Projects />
        )} />
      </div>
    );
  }
}

export default App;
