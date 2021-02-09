import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Contacts from './components/containers/Contacts/Contacts';
import Transactions from './components/containers/Transactions/Transactions'
import classes from './App.css'
import Projects from './components/containers/Projects/Projects'
import AuthContext from './context/auth-context'
import Company from './components/containers/Company/Company'
import Home from './components/containers/Home/Home';
import LocalizedStrings from 'react-localization';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
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

    let strings = new LocalizedStrings({
      en:{
        pleaseLogin: "Please log in to access this page."
      },
      es: {
        pleaseLogin: "Favor de iniciar sesión para ingresar a esta página."
      }
     });
    let language = navigator.language;
    if (localStorage.getItem('language') !== null){
        language = localStorage.getItem('language');
    } else if (sessionStorage.getItem('language') !== null){
        language = sessionStorage.getItem('language');
    } 
    strings.setLanguage(language);
    if (!this.context.authenticated && this.props.location.pathname !== "/"){
      this.context.setAlerts([{
        title: strings.pleaseLogin,
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
    let homepage = this.context.authenticated ? (
      <Transactions />
    ) : (
      <Home />
    )
    if (this.state.redirect) {
      const url = this.state.redirect
      this.setState({redirect: null})
      return <Redirect to={url} />
    }

    if (this.checkAuthenticated()){

      return <Redirect to="/" />
    }


    return (
      <div className={classes.App}>
        <Route path="/" exact render={() => (homepage)} />
        <Route path="/clientes" render={() => (
          <Contacts clients={true} providers={false} />
        )} />
        <Route path="/proveedores" render={() => (
          <Contacts providers={true} clients={false} />
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
