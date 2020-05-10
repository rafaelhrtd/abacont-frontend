import React, { Component } from 'react';
import classes from './DeleteButton.css';
import Button from '../Button/Button';
import Aux from '../../../hoc/Aux/Aux';
import Modal from '../../Modal/Modal';
import Axios from 'axios';
import AuthContext from '../../../context/auth-context'
import { Redirect } from 'react-router-dom';

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
        console.log(data)
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
            console.log(error)
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
                placeholder="Contraseña"
                value={this.state.password}
                className={inputClass}
                onChange={event => this.passwordListener(event)}>
            </input>
        )
        deleteMessage = "¿También deseas eliminar los movimientos "
        if (this.state.has_children && !this.state.question_answered){
            if (this.state.objectType === "contact"){
                deleteMessage += "y proyectos pertenecientes a este contacto?"
            } else if (this.state.objectType === "project") {
                deleteMessage += "pertenecientes a este proyecto?"                
            } else if (this.state.objectType === "receivable") {
                deleteMessage += "pertenecientes a esta cuenta por cobrar?"      
            } else if (this.state.objectType === "payable") {
                deleteMessage += "pertenecientes a esta cuenta por pagar?"
            }
        } else {
            deleteMessage = ""
            if (this.state.destroy_children){
                deleteMessage = "Todos los artículos dependientes serán eliminados. "
            }
            deleteMessage += "Introduce tu contraseña para confirmar la eliminación."
        }
        let content = null
        if (this.state.has_children && !this.state.question_answered){
            content = (
                <div>
                    <p>{deleteMessage}</p>
                    <div className={classes.buttons}>
                        <Button className="danger" onClick={() => this.destroyChildrenHandler(true)}>
                            Sí
                        </Button>
                        <Button className="warning" onClick={() => this.destroyChildrenHandler(false)}>
                            No
                        </Button>
                        <Button className="primary" onClick={this.showHandler}>
                            Cancelar
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
                            Confirmar
                        </Button>
                        <Button className="primary" onClick={this.showHandler}>
                            Cancelar
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
                    Eliminar
                </Button>
                <Modal 
                    show={this.state.show}
                    showHandler={this.showHandler}>
                    <h3>Eliminar</h3>
                    {error}
                    {content}
                </Modal>
            </Aux>
        )
    }
}

export default DeleteButton;