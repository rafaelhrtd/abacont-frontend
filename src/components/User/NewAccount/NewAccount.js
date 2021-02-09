import React, { Component } from 'react';
import classes from './NewAccount.css';
import Form from './Form/Form';
import axios from 'axios';
import AuthContext from '../../../context/auth-context';
import Aux from '../../../hoc/Aux/Aux';
import LocalizedStrings from 'react-localization';

class NewAccount extends Component {
    state = {
        email: this.context.user ? this.context.user.email : null,
        first_name: null,
        last_name: null,
        "company.name": null,
        password: null,
        password_confirmation: null,
        current_password: null,
        language: "en",
        errors: {}
    }

    static contextType = AuthContext;

    changeHandler = (event) => {
        event.persist()
        this.setState((PrevState) => {
            return (
                {
                    [event.target.name] : event.target.value
                }
            )
        })
        delete this.state.errors[event.target.name]
    }
    createAccountHandler  = (event) => {
        event.preventDefault();
        let data = {
          user: {
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            password: this.state.password,
            password_confirmation: ((this.state.password_confirmation === null && this.state.password !== null)? "-" : this.state.password_confirmation),
            language: this.state.language,
            company_attributes: { name: this.state["company.name"] }
          }
        }
        axios.post(process.env.REACT_APP_API_ADDRESS + "signup", data)
          .then(response => {
              if (response.status === 200){
                  if (response.data.errors === undefined){
                    this.context.login(response)
                    this.props.new_account()
                  } else {
                      const errors = response.data.errors 
                      if (errors.company !== undefined){
                          delete errors.company
                      }
                      this.setState({errors: response.data.errors})
                  }
              }
            }
          )
    }
    editAccountHandler  = (event) => {
        event.preventDefault();
        let data = {
          user: {
            id: this.context.user.id,
            email: this.state.email,
            password: this.state.password,
            language: this.state.language,
            password_confirmation: ((this.state.password_confirmation === null && this.state.password !== null)? "-" : this.state.password_confirmation),
            current_password: this.state.current_password
          }
        }
        axios.put(process.env.REACT_APP_API_ADDRESS + "signup", data)
          .then(response => {
              if (response.status === 200){
                  if (response.data.errors === undefined){
                    
                    this.context.setAlerts([
                        {title: "Cambios guardados",
                         classes: ["success"],
                         message: null}
                    ]);
                    this.props.backHandler();
                    this.context.updateUserInfo();
                  } else {
                      const errors = response.data.errors 
                      if (errors.company !== undefined){
                          delete errors.company
                      }
                      this.setState({errors: response.data.errors})
                  }
              }
            }
          )
    }

    errorsHandler = (errors) => {
        this.setState({errors: errors})
    }

    render(){
        let strings = new LocalizedStrings({
          en:{
              createAccountTitle: "Create your account",
              editAccountTitle: "Account changes",
              or: "or",
              login: "log in",
              name: "Name",
              lastName: "Last name",
              email: "Email",
              company: "Company",
              english: "English",
              spanish: "Spanish",
              currentPassword: "Current password",
              password: "Password",
              confirmPassword: "Confirm password",
              createAccount: "Create account",
              back: "Back"
          },
          es: {
            createAccountTitle: "Crea tu cuenta",
            editAccountTitle: "Cambios a cuenta",
            or: "o",
            login: "inicia sesión",
            name: "Nombre",
            lastName: "Apellido",
            email: "Email",
            company: "Compañía",
            english: "Inglés",
            spanish: "Español",
            currentPassword: "Contraseña actual",
            password: "Contraseña",
            confirmPassword: "Confirmar contraseña",
            createAccount: "Crear cuenta",
            back: "Volver"
          }
         });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        } 
        return (
            <div className={classes.NewAccount}>
                <div className={classes.titleHolder}>
                    {this.props.edit ? (
                        <h2>{strings.editAccountTitle}</h2>
                    ):(
                        <Aux>
                        <h2>{strings.createAccountTitle}</h2>
                            <div className={classes.SignIn}>
                                {strings.or} <span className={classes.AccountLink} onClick={this.props.new_account}>{strings.login}</span>
                            </div>
                        </Aux>
                    )}
                </div>
                    <Form 
                        changed={this.changeHandler} 
                        submit={this.props.edit ? this.editAccountHandler : this.createAccountHandler}
                        errors={this.state.errors}
                        email={this.state.email}
                        edit={this.props.edit}
                        strings={strings}
                        backHandler={this.props.backHandler} />
            </div>
        )

    }
}

export default NewAccount