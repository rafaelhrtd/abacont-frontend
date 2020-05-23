import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Aux from './hoc/Aux/Aux'
import Contacts from './components/containers/Contacts/Contacts';
import Transactions from './components/containers/Transactions/Transactions'
import classes from './App.css'
import Projects from './components/containers/Projects/Projects'
import AuthContext from './context/auth-context'
import Company from './components/containers/Company/Company'
import Axios from 'axios'
class App extends Component {
  state = {
    email: null,
    password: null,
    redirect: null
  }

  static contextType = AuthContext;
  
  componentDidUpdate(prevProps, prevState){
    if (prevProps.redirect !== this.props.redirect){
      this.setState({redirect: this.props.redirect});
      this.props.removeRedirect();
    }
  }

  checkAuthenticated = () => {
    if (!this.context.authenticated && this.props.location.pathname !== "/"){
      this.context.setAlerts([{
        title: "Favor de iniciar sesión para ingresar a esta página",
        classes: ["danger"],
        message: null
      }])
      return true;
    }
  }

  componentDidMount = () => {
    this.checkAuthenticated();
  }

  componentDidUpdate = () => {
    this.checkAuthenticated();
  }

  render() {
    
    
    if (this.state.redirect) {
      console.log("what in the fuck")
      const url = this.state.redirect
      console.log(url)
      this.setState({redirect: null})
      return <Redirect to={url} />
    }

    if (this.checkAuthenticated()){

      return <Redirect to="/" />
    }


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
        <Route path="/compañía" render={() => (
          <Company />
        )} />
      </div>
    );
  }
}

export default withRouter(App);
