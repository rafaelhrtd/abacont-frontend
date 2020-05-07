import React, { Component } from 'react';
import FormHolder from '../../../../helpers/FormHolder';
import AuthContext from '../../../../context/auth-context';
import classes from './NewContact.css';
import Form from '../../../Form/Form';
import { withRouter, Redirect } from 'react-router-dom' ;

class NewContact extends FormHolder {
    state = {
        category: (this.props.category),
        errors: {},
        form_data: { "contact.category" : this.props.category},
        old_data: {},
        contact: this.props.contact
    }

    static contextType = AuthContext;
    
    createContactHandler = (event, edit=false) => {
        event.preventDefault()
        let data = this.setUpData(this.state.form_data)
        let url = process.env.REACT_APP_API_ADDRESS + "contacts"
        url += edit === true ? "/" + this.props.contact.id : ""
        this.submitHandler(event, 
                            url, 
                            data, 
                            this.successResponse, 
                            this.errorResponse, 
                            null,
                            edit)
    }

    successResponse = (data, url = null) => {
        let redirect_url = this.props.redirect_url
        if (redirect_url !== undefined) {
            this.setState({redirect: redirect_url})
        } else {
            const category = this.state.category === "client" ? "/clientes/" : "/proveedores/"
            const redirectUrl = url === null ? category + data.contact.id : url 
            this.setState({redirect: redirectUrl})
        }
    }

    errorResponse = (errors) => {
        this.setState({errors: errors})
    }
    static formElements = (category) => {
        let inputs = {
            name: {
                inputType: "text",
                name: "name",
                placeholder: "Nombre",
                blank: false
            },
            email: {
                inputType: "email",
                name: "email",
                placeholder: "Email"
            },
            phone: {
                inputType: "text",
                name: "phone",
                placeholder: "Teléfono"
            },
            category: {
                name: "category",
                inputType: "hidden",
                value: category,
                blank: false
            }
        }
        return inputs
    }

    componentDidMount(){
        if (this.props.contact !== undefined && this.state.contact !== undefined){
            this.setState({contact: this.props.contact})
            this.getPreviousValues(this.props.contact, "contact.");
        }
    }

    render(){

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const url=process.env.REACT_APP_API_ADDRESS + "contacts"
        const saveTitle = this.props.contact !== undefined ? "Guardar" : "Crear"
        const titleStart = this.props.contact !== undefined ? "Editar " : "Nuevo "
        return(
            <div className={classes.NewContact}>
                <h1>{titleStart} {this.state.category === "client" ? "cliente":"proveedor"}</h1>
                <div className={classes.FormDiv}>
                    <Form
                        changed={this.changeHandler}
                        submit={this.createContactHandler}
                        inputs={NewContact.formElements(this.props.category)}
                        errors={this.state.errors}
                        suffix="contact."
                        submitText={saveTitle}
                        previousValues={this.state.form_data}
                        edit={this.props.contact !== undefined}
                        old_data={this.state.old_data} />
                </div>
            </div>
        )
    }

}

export default withRouter(NewContact);