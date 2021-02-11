import React, {Component} from 'react';
import Button from '../../../../UI/Buttons/Button/Button';
import Modal from '../../../../UI/Modal/Modal';
import Axios from 'axios';
import classes from './Inviter.css';
import AuthContext from '../../../../context/auth-context';
import Permissions from '../Permissions/Permissions';
import LocalizedStrings from 'react-localization';

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

    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                creatingInvite: "Creating invitation.",
                inviteSent: "Invitation sent.",
                inviteMember: "Invite member",
                privileges: "Privileges",
                invite: "Invite",
                explanation: "Enter the email of the person you want to invite. They will receive an email with instructions to create their account, or, if they are already registered, an invitation to join this company."
            },
            es: {
                creatingInvite: "Creando invitación.",
                inviteSent: "Invitación enviada.",
                inviteMember: "Invitar miembro",
                privileges: "Permisos",
                invite: "Invitar",
                explanation: "Ingresa el e-mail de la persona que quieres invitar. Se le enviará un correo con las instrucciones para crear su cuenta o, si ya están registrados, una invitación para formar parte de esta compañía."
            }
           });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }

        language = language ? language : "en"
        strings.setLanguage(language)
        return strings;
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

    successHandler = (data) => {
        this.props.addInvite();
        this.context.toggleLoader(this.strings().creatingInvite);
        this.showHandler()
        this.context.setAlerts([
            {title: this.strings().inviteSent,
             classes: ["success"],
             message: null}
        ])
    }

    errorHandler = (data) => {
        this.setState({errors: data.errors})
        this.context.toggleLoader(this.strings().creatingInvite);
    }

    commErrorHandler = (response) => {
        this.context.toggleLoader(this.strings().creatingInvite);
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.context.toggleLoader(this.strings().creatingInvite);
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
    }


    render() {
        const emailClass = Object.keys(this.state.errors).length === 0 ? null : classes.error
        return (
            <div>
                <Button 
                    className="success"
                    onClick={this.showHandler}>
                    {this.strings().inviteMember}
                </Button>
                <Modal
                    show={this.state.showModal}
                    showHandler={this.showHandler}
                    className={classes.Modal}
                    >
                    <h2>{this.strings().inviteMember}</h2>
                        <p>{this.strings().explanation}</p>
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
                            <h3>{this.strings().privileges}:</h3>
                            <Permissions
                                changeHandler = {this.changeHandler}
                                can_read = {this.state.can_read}
                                can_write = {this.state.can_write}
                                can_edit = {this.state.can_edit}
                                can_invite = {this.state.can_invite}
                                inviteDisabled={this.state.inviteDisabled}
                            />

                            <input type="submit" value={this.strings().invite} className="btn-success" />
                        </form>
                </Modal>
            </div>
        )
    }
}

export default Invite;