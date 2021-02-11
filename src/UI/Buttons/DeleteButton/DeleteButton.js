import React, { Component } from 'react';
import classes from './DeleteButton.css';
import Button from '../Button/Button';
import Aux from '../../../hoc/Aux/Aux';
import Modal from '../../Modal/Modal';
import Axios from 'axios';
import AuthContext from '../../../context/auth-context'
import { Redirect } from 'react-router-dom';
import LocalizedStrings from 'react-localization';

class DeleteButton extends Component {
    state = {
        show: false,
        has_children: false,
        question_answered: false,
        destroy_children: false,
        password: "",
        redirectPath: null,
        error: null
    }

    static contextType = AuthContext;

    showHandler = () => {
        this.setState(prevState => {
            return {
                show: !prevState.show, 
                question_answered: false,
                password: ""}})
    }


    componentDidMount = () => {
        const object = this.props.object
        const objectType = Object.keys(object)[0]
        if (objectType === "contact" || objectType === "project") {
            this.setState({has_children: true,
                           object: object[objectType],
                           objectType: objectType
                        })
        } else if (objectType === "transaction") {
            if (["receivable", "payable"].includes(object[objectType].category)) {
                this.setState({has_children: true,
                               object: object[objectType],
                               objectType: object[objectType].category})
            }
        }
        this.setState({
            url: process.env.REACT_APP_API_ADDRESS + objectType + "s/" + object[objectType].id
        })
    }

    successHandler = (data) => {
        this.context.toggleLoader("Eliminando");
        this.setState({redirectPath: this.props.redirectPath})
    }

    errorHandler = (data) => {
        this.context.toggleLoader();
        this.setState({error: data.error})
    }
    
    submitDeleteRequest = () => {
        this.context.toggleLoader("Eliminando");
        const data = {
            password: this.state.password,
            destroy_children: this.state.destroy_children
        }
        
        Axios.delete(this.state.url, {params: {...data}})
        .then(response => {
            if (response.status === 200) {
                if (response.data.error === undefined){
                    this.successHandler(response.data)
                } else {
                    this.errorHandler(response.data)
                }
            }
        }, error => {
        })
    }

    passwordListener = (event) => {
        this.setState({
            password: event.target.value,
            error: null
        })
    }
    
    destroyChildrenHandler = (destroy) => {
        this.setState({destroy_children: destroy, question_answered: true})
    }

    render(){
        let strings = new LocalizedStrings({
            en:{
                delete: "Delete",
                password: "Password",
                deleteMessage: "Do you also wish to delete the movements (revenues, expenses, and accounts payable and receivable) ",
                deleteMessageOne: "and projects belonging to this contact?",
                deleteMessageTwo: "belonging to this project?",
                deleteMessageThree: "belonging to this account receivable?",
                deleteMessageFour: "belonging to this account payable?",
                allWillBeDeleted: "All dependent articles will be deleted. ",
                enterYourPassword: "Please enter your password to confirm:",
                yes: "Yes",
                no: "No",
                cancel: "Cancel",
                confirm: "Confirm"
            },
            es: {
                delete: "Eliminar",
                password: "Contraseña",
                deleteMessage: "¿También deseas eliminar los movimientos ",
                deleteMessageOne: "y proyectos pertenecientes a este contacto?",
                deleteMessageTwo: "pertenecientes a este proyecto?",
                deleteMessageThree: "pertenecientes a esta cuenta por cobrar?",
                deleteMessageFour: "pertenecientes a esta cuenta por pagar?",
                allWillBeDeleted: "Todos los artículos dependientes serán eliminados. ",
                enterYourPassword: "Introduce tu contraseña para confirmar la eliminación:",
                yes: "Sí",
                no: "No",
                cancel: "Cancelar",
                confirm: "Confirmar"
            }
        });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        language = language ? language : "en"
        strings.setLanguage(language);
        const inputClass = this.state.error === null ? null : classes.danger
        if (this.state.redirectPath !== null){
            return <Redirect to={{
                pathname: this.state.redirectPath,
                state: {deleted: Math.random()}}} />
        }
        let deleteMessage = ""
        let password = (
            <input 
                type="password"
                placeholder={strings.password}
                value={this.state.password}
                className={inputClass}
                onChange={event => this.passwordListener(event)}>
            </input>
        )
        deleteMessage = strings.deleteMessage
        if (this.state.has_children && !this.state.question_answered){
            if (this.state.objectType === "contact"){
                deleteMessage += strings.deleteMessageOne
            } else if (this.state.objectType === "project") {
                deleteMessage += strings.deleteMessageTwo
            } else if (this.state.objectType === "receivable") {
                deleteMessage += strings.deleteMessageThree
            } else if (this.state.objectType === "payable") {
                deleteMessage += strings.deleteMessageFour
            }
        } else {
            deleteMessage = ""
            if (this.state.destroy_children){
                deleteMessage = strings.allWillBeDeleted
            }
            deleteMessage += strings.enterYourPassword
        }
        let content = null
        if (this.state.has_children && !this.state.question_answered){
            content = (
                <div>
                    <p>{deleteMessage}</p>
                    <div className={classes.buttons}>
                        <Button className="danger" onClick={() => this.destroyChildrenHandler(true)}>
                            {strings.yes}
                        </Button>
                        <Button className="warning" onClick={() => this.destroyChildrenHandler(false)}>
                            {strings.no}
                        </Button>
                        <Button className="primary" onClick={this.showHandler}>
                            {strings.cancel}
                        </Button>
                    </div>
                </div>
            )
        } else {
            content = (
                <div>
                    <p>{deleteMessage}</p>
                    {password}
                    <div className={classes.buttons}>
                        <Button className="danger" onClick={this.submitDeleteRequest}>
                            {strings.confirm}
                        </Button>
                        <Button className="primary" onClick={this.showHandler}>
                            {strings.cancel}
                        </Button>
                    </div>
                </div>
            )
        }
        const error = this.state.error === {} ? null : (
            <div className={classes.errors}>
                {this.state.error}
            </div>
        )
        return(
            <Aux>
                <Button className="danger" onClick={this.showHandler}>
                    {strings.delete}
                </Button>
                <Modal 
                    show={this.state.show}
                    showHandler={this.showHandler}>
                    <h3>{strings.delete}</h3>
                    {error}
                    {content}
                </Modal>
            </Aux>
        )
    }
}

export default DeleteButton;