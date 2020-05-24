import React, {Component} from 'react';
import Button from '../../../../UI/Buttons/Button/Button';
import Modal from '../../../../UI/Modal/Modal';
import Axios from 'axios';
import CheckBox from '../../../../UI/FormElements/CheckBox/CheckBox'
import classes from './Inviter.css'
import AuthContext from '../../../../context/auth-context'

class Invite extends Component {
    state = {
        email: null,
        role: null,
        can_read: true,
        can_edit: false,
        can_write: false,
        can_invite: false,
        inviteDisabled: true,
        showModal: false,
        errors: {}
    }
    
    static contextType = AuthContext;

    showHandler = () => {
        this.setState(prevState => {return {showModal: !prevState.showModal}})
    }

    changeHandler = (event, object = null) => {
        if (object === null) {
            this.setState({ 
                [event.target.name]: event.target.value
            })
        } else {
            this.setState({
                [object.name] : object.value
            })
        }
    }

    componentDidMount = () => {
    }

    componentDidUpdate = () => {
        // disable invite if !can_edit and !can_write
        if ((this.state.can_edit === false || this.state.can_write === false) && this.state.inviteDisabled === false){
            this.setState({
                inviteDisabled: true,
                can_invite: false})
        } else if (this.state.can_edit === true && this.state.can_write === true && this.state.inviteDisabled === true) {
            this.setState({
                inviteDisabled: false,
            })
        }
    }

    successHandler = (data) => {
        this.props.addInvite();
        this.context.toggleLoader("Creando invitación");
        this.showHandler()
        this.context.setAlerts([
            {title: "Invitación enviada.",
             classes: ["success"],
             message: null}
        ])
    }

    errorHandler = (data) => {
        this.setState({errors: data.errors})
        this.context.toggleLoader("Creando invitación");
    }

    commErrorHandler = (response) => {
        console.log(response)
        this.context.toggleLoader("Creando invitación");
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.context.toggleLoader("Creando invitación");
        const data = {
            invite: {
                email: this.state.email,
                can_read: this.state.can_read,
                can_write: this.state.can_write,
                can_edit: this.state.can_edit,
                can_invite: this.state.can_invite
            }
        }
        const url = process.env.REACT_APP_API_ADDRESS + "/send_invite";
        Axios.post(url, {...data})
            .then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        this.successHandler(response.data)
                    } else {
                        this.errorHandler(response.data)
                    }
                }
            }, error => {
                this.commErrorHandler(error.response)
            })
        console.log(event)
    }


    render() {
        const emailClass = Object.keys(this.state.errors).length === 0 ? null : classes.error
        return (
            <div>
                <Button 
                    className="success"
                    onClick={this.showHandler}>
                    Agregar miembro
                </Button>
                <Modal
                    show={this.state.showModal}
                    showHandler={this.showHandler}
                    className={classes.Modal}
                    >
                    <h2>Invitar miembro</h2>
                    <p>Ingresa el e-mail de la persona que quieres invitar. Se le enviará un correo
                        con las instrucciones para crear su cuenta o, si ya están registrados,
                        una invitación para formar parte de esta compañía.</p>
                        <form onSubmit={event => {this.submitHandler(event)}}>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="E-mail"
                                className={emailClass}
                                onChange={event => this.changeHandler(event)} />
                                {Object.keys(this.state.errors).map(key => (
                                    this.state.errors[key].map(error => (
                                        <p key={key} className={classes.error}>
                                            {error}
                                        </p>
                                    ))
                                ))}
                            <h3>Permisos:</h3>
                            <CheckBox  
                                givenClass={classes.privilege}
                                name={'can_read'}
                                text={"Lectura"}
                                changed={this.changeHandler}
                                disabled={true}
                                initVal={this.state.can_read} />
                            <CheckBox  
                                givenClass={classes.privilege}
                                name={'can_write'}
                                text={"Escritura"}
                                initVal={this.state.can_write}
                                changed={this.changeHandler}/>
                            <CheckBox  
                                givenClass={classes.privilege}
                                name={'can_edit'}
                                initVal={this.state.can_edit}
                                text={"Edición y eliminación"}
                                changed={this.changeHandler}/>
                            <CheckBox  
                                givenClass={classes.privilege}
                                name={'can_invite'}
                                text={"Invitación (se requieren todos los permisos)"}
                                changed={this.changeHandler}
                                disabled={this.state.inviteDisabled}
                                initVal={this.state.can_invite} />

                            <input type="submit" value="Invitar" className="btn-success" />
                        </form>
                </Modal>
            </div>
        )
    }
}

export default Invite;