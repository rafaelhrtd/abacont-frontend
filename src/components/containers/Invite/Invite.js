import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Axios from 'axios';
import classes from './Invite.css';
import AuthContext from '../../../context/auth-context';
import Button from '../../../UI/Buttons/Button/Button';

class Invite extends Component {
    state = {
        invite: null,
        error: null,
        redirect: null,
        errors: {},
        form_data: {},
        retrieval_attempted: false
    }
    
    static contextType = AuthContext;
    
    parseQuery = () => {
        const result = {}
        this.props.location.search.split("?").map(query => {
            if (query.length > 0) {
                result[query.split("=")[0]] = query.split("=")[1]
            }
        })
        return result;
    }

    commError = (error) => {
        console.log(error);
    }
    
    getInvite = (token) => {
        const url = process.env.REACT_APP_API_ADDRESS + "/get_invite?token=" + token;
        Axios.get(url)
            .then(response => {
                if (response.data.error === undefined && this.state.redirect == null){
                    this.context.logout();
                    if (response.data.user !== null){
                        this.context.login(response, this.state.remember_me)
                    }
                    console.log(response)
                    this.setState({
                        invite: response.data.invite,
                        name: response.data.name,
                        company_name: response.data.company_name,
                        retrieval_attempted: true})
                } else {
                    this.setState({error: true})
                }
            }, error => {
                this.commError(error)
            })
    }
    
    componentDidMount = () => {
        this.getInvite(this.parseQuery().token)
    }

    changeHandler = (event) => {
        event.persist();
        this.setState(prevState => {
            let form_data = {...prevState.form_data}
            form_data[event.target.name] = event.target.value
            let errors = {...prevState.errors}
            delete errors[event.target.name]
            return({form_data: form_data, errors: errors});
        });
    }

    submitHandler = (event) => {
        event.preventDefault()
        const data = {
            user: {...this.state.form_data, token: this.state.invite.token, email: this.state.invite.email}
        }
        
        Axios.post(process.env.REACT_APP_API_ADDRESS + "signup", data)
          .then(response => {
              if (response.status === 200){
                  if (response.data.errors === undefined){
                    this.context.login(response)
                    this.setState({redirect: '/'})
                    this.context.setAlerts([{
                        title: "Ahora eres parte del equipo de " + this.state.company_name,
                        classes: ["success"],
                        message: null
                    }]);
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

    existingUserHandler = (accepted) => {
        const url = process.env.REACT_APP_API_ADDRESS + "/claim_invite";

        const data = {
            user: this.context.user,
            token: this.state.invite.token,
            accepted: accepted
        }
        Axios.post(url, data)
            .then(response => {
                if (response.data.error === undefined){
                    console.log(response)
                    this.context.updateUserInfo();
                    this.context.setAlerts([{
                        title: "Ahora eres parte del equipo de " + this.state.company_name,
                        classes: ["success"],
                        message: null
                    }]);
                    this.setState({redirect: '/'});
                } else {
                    this.context.setAlerts([{
                        title: "Se ha producido un error en el servidor.",
                        classes: ["danger"],
                        message: null
                    }]);
                    this.setState({redirect: '/'});
                }
            }, error => {
                this.commError(error)
            })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        if (this.state.invite !== null && this.context.authenticated){
            
            return(
                <div className={classes.Invite}>
                    <h2>Invitación a {this.state.company_name}</h2>
                    <p>{this.state.name} te ha invitado a unirte a su equipo. Selecciona una de las siguientes opciones para aceptar o cancelar la invitación.</p>
                    <div className={classes.Options}>
                        <Button className="danger" onClick={() => this.existingUserHandler(false)}>
                            Cancelar
                        </Button>
                        <Button className="primary" onClick={() => this.existingUserHandler(true)}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            )

        } else if (this.state.invite !== null) {

            return(
                <div className={classes.Invite}>
                    <h2>Invitación a {this.state.company_name}</h2>
                    <p>{this.state.name} te ha invitado a unirte a su equipo. Selecciona una de las siguientes opciones para aceptar o cancelar la invitación.</p>
                    {Object.keys(this.state.errors).length !== 0 ? (
                        <div className={classes.errors}>
                            {Object.keys(this.state.errors).map(key => (
                                <p class={classes.error}>{this.state.errors[key][0]}</p>
                            ))}
                        </div>
                    ) : null}
                    <div className={classes.Form}>
                        <form onSubmit={event => this.submitHandler(event)}>
                            <input type="text" className={this.state.errors.first_name === undefined ? null : classes.error} name="first_name" placeholder="Nombre" value={this.state.form_data.first_name} onChange={event => this.changeHandler(event)} />
                            <input type="text" className={this.state.errors.last_name === undefined ? null : classes.error} name="last_name" placeholder="Apellido" value={this.state.form_data.last_name} onChange={event => this.changeHandler(event)} />
                            <input type="email" name="email" disabled="true" placeholder="Email" value={this.state.invite.email} onChange={event => this.changeHandler(event)} />
                            <input type="password" className={this.state.errors.password === undefined ? null : classes.error} name="password" placeholder="Contraseña" value={this.state.form_data.password} onChange={event => this.changeHandler(event)} />
                            <input type="password" className={this.state.errors.password === undefined ? null : classes.error} name="password_confirmation" placeholder="Confirmar contraseña" value={this.state.form_data.password_confirmation} onChange={event => this.changeHandler(event)} />
                            <input type="submit" value={"Únete a " + this.state.company_name} className="btn-success" />
                        </form>
                    </div>
                </div>
            )
        } else if (this.state.retrieval_attempted) {
            setTimeout(()=> {
                this.setState({redirect: '/'})
            }, 4000);
            return(
                <div className={classes.Invite}>
                    <h3>La invitación no ha sido encontrada</h3>
                    <p>Es posible que haya sido cancelada o que ya haya sido aceptada. Por favor, comunícate con el adminsitrador de la compañía a la que quieres unirte.</p>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

export default withRouter(Invite);