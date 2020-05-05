import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Aux from './hoc/Aux/Aux'
import Contacts from './components/containers/Contacts/Contacts';
import Transactions from './components/containers/Transactions/Transactions'
import classes from './App.css'
class App extends Component {
  state = {
    email: null,
    password: null
  }
  render() {
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
          <h1>Proyectos</h1>
        )} />
      </div>
    );
  }
}

export default App;
