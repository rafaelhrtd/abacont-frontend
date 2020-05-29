import React, { Component } from 'react'
import classes from './Login.css'
import axios from 'axios'
import AuthContext from '../../../context/auth-context'
import LoginForm from './Form/LoginForm'

class Login extends Component {
    state = {
        email: null,
        password: null,
        remember_me: false,
        error:  false,
        error_objects: {}
    }

    static contextType = AuthContext;

    changeHandler = (event = null, object = null) => {
        if (event !== null){
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
        } else if (object !== null) {
            this.setState({
                [object.name] : object.value
            })
        }
    }

    loginHandler  = (event) => {
        this.setState({error_objects: {}})
        event.preventDefault();
        let data = {
          user: {
            email: this.state.email,
            password: this.state.password,
            remember_me: true
          }
        }
        axios.post(process.env.REACT_APP_API_ADDRESS + "login", data)
          .then(response => {
            if (response.status === 200){
                this.context.login(response, this.state.remember_me)
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
                    rememberMeVal={this.state.remember_me}
                    remember={this.changeHandler}
                    changed={this.changeHandler}
                    login={this.loginHandler}
                    errorObjects={this.state.error_objects} />
            </div>
        )
    }
}

export default Login