import React, { Component } from 'react';
import FormHolder from '../../../../helpers/FormHolder';
import AuthContext from '../../../../context/auth-context';
import classes from './NewContact.css';
import Form from '../../../Form/Form';
import Contact from '../Contact/Contact'
import { withRouter, Redirect } from 'react-router-dom' ;
import LocalizedStrings from 'react-localization';

class NewContact extends FormHolder {
    state = {
        category: (this.props.category),
        errors: {},
        form_data: { "contact.category" : this.props.category},
        old_data: {},
        contact: this.props.contact
    }

    static contextType = AuthContext;
    
    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                changedSaved: "Changes saved.",
                save: "Save",
                create: "Create",
                new: "New ",
                edit: "Edit ",
                client: "Client",
                provider: "Provider"
            },
            es: {
                changedSaved: "Cambios guardados.",
                save: "Guardar",
                create: "Crear",
                new: "Nuevo ",
                edit: "Editar ",
                client: "Cliente",
                provider: "Proveedor"
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
        return strings
    }

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
        if (this.state.old_data === {}){
            this.context.setAlerts([
                {title: this.strings().changedSaved,
                 classes: ["success"],
                 message: null}
            ])
        } else {
            this.context.setAlerts([
                {
                    title: Contact.getName(this.state.category, true) + " creado.",
                    classes: ["success"],
                    message: null
                }
            ])
        }

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
        let strings = new LocalizedStrings({
            en:{
                name: "Name",
                email: "Email",
                phone: "Phone"
            },
            es: {
                name: "Name",
                email: "Email",
                phone: "Phone"
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
        let inputs = {
            name: {
                inputType: "text",
                name: "name",
                placeholder: strings.name,
                blank: false
            },
            email: {
                inputType: "email",
                name: "email",
                placeholder: strings.email
            },
            phone: {
                inputType: "text",
                name: "phone",
                placeholder: strings.phone
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
        const saveTitle = this.props.contact !== undefined ? this.strings().save : this.strings().create
        const titleStart = this.props.contact !== undefined ? this.strings().edit : this.strings().new
        return(
            <div className={classes.NewContact}>
                <h1>{titleStart} {this.state.category === "client" ? this.strings().client : this.strings().provider}</h1>
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