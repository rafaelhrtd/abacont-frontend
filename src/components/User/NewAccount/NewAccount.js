import React, { Component } from 'react';
import classes from './NewAccount.css';
import Form from './Form/Form';
import axios from 'axios';
import AuthContext from '../../../context/auth-context'

class NewAccount extends Component {
    state = {
        email: null,
        first_name: null,
        last_name: null,
        "company.name": null,
        password: null,
        password_confirmation: null,
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
            company_attributes: { name: this.state["company.name"] }
          }
        }
        axios.post("http://localhost:3000/signup", data)
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

    errorsHandler = (errors) => {
        this.setState({errors: errors})
    }

    render(){
        return (
            <div className={classes.NewAccount}>
                <div className={classes.titleHolder}>
                    <h2>Crea tu cuenta</h2>
                    <div className={classes.SignIn}>
                        o <span className={classes.AccountLink} onClick={this.props.new_account}>inicia sesión</span>
                    </div>
                </div>
                <Form 
                    changed={this.changeHandler} 
                    submit={this.createAccountHandler}
                    errors={this.state.errors} />
            </div>
        )

    }
}

export default NewAccount