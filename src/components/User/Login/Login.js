import React, { Component } from 'react'
import classes from './Login.css'
import axios from 'axios'
import AuthContext from '../../../context/auth-context'
import LoginForm from './Form/LoginForm'

class Login extends Component {
    state = {
        email: null,
        password: null,
        rememberMe: false,
        error:  false,
        error_objects: {}
    }

    static contextType = AuthContext;

    changeHandler = (event) => {
        event.persist()
        this.setState((prevState) => {
            let errors = {...prevState.error_objects}
            if (errors[event.target.name] !== undefined){
                delete errors[event.target.name]
            }
            return({
                error_objects: errors,
                [event.target.name] : event.target.value
            })
        })
    }

    rememberMeHandler = (event) => {
        this.setState((prevState, props) => ({
            rememberMe: !prevState.rememberMe
        }))
    }

    loginHandler  = (event) => {
        this.setState({error_objects: {}})
        event.preventDefault();
        let data = {
          user: {
            email: this.state.email,
            password: this.state.password,
            rememberMe: true
          }
        }
        axios.post("http://localhost:3000/login", data)
          .then(response => {
            if (response.status === 200){
                this.context.login(response, this.state.rememberMe)
            }
        }).catch(error => {
            this.loginErrorHandler(error);
        })
    }

    loginErrorHandler = () => {
        this.setState({error: true})
        if (this.state.email === null || this.state.email.length === 0){
            this.setState((prevState) => {
                let errors = {...prevState.error_objects}
                errors["email"] = "Por favor, introduce tu e-mail."
                return ({error_objects: errors})
            })
        } 
        if (this.state.password === null || this.state.password.length === 0) {
            this.setState((prevState) => {
                let errors = {...prevState.error_objects}
                errors["password"] = "Por favor, introduce tu contraseña."
                return ({error_objects: errors})
            })
        } else if (Object.keys(this.state.error_objects).length === 0) {
            this.setState((prevState) => {
                let errors = {...prevState.error_objects}
                errors["form"] = "E-mail o contraseña inválida."
                return ({error_objects: errors})
            })
        }
    }

    render (){
        return (
            <div className={classes.Login}>
                <div className={classes.titleHolder}>
                    <h2>Inicia sesión</h2>
                    <div className={classes.CreateAccount}>
                        o <span className={classes.AccountLink} onClick={this.props.new_account}>crea tu cuenta</span>
                    </div>
                </div>
                <LoginForm
                    remember={this.rememberMeHandler}
                    changed={this.changeHandler}
                    login={this.loginHandler}
                    errorObjects={this.state.error_objects} />
            </div>
        )
    }
}

export default Login