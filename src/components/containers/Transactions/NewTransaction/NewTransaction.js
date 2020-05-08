import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import classes from './NewTransaction.css';
import FormHolder from '../../../../helpers/FormHolder';
import Form from '../../../Form/Form';
import NewContact from '../../Contacts/NewContact/NewContact';
import NewProject from '../../Projects/NewProject/NewProject';
import AuthContext from '../../../../context/auth-context';
import Transaction from '../Transaction/Transaction'

class NewTransaction extends FormHolder {
    state = {...this.state,
        category: this.props.category,
        form_data: { "transaction.category" : this.props.category},
        passed_state: this.props.location.state,
        errors: {},
        old_data: {},
        transaction: this.props.transaction
    }
    static contextType = AuthContext;

    successResponse = (data, url = null) => {
        let passed_state = this.state.passed_state
        if (passed_state !== undefined && passed_state.path !== undefined) {
            this.setState({redirect: passed_state.path})
        } else {
            const redirectUrl = url !== null ? url : Transaction.getUrl(data.transaction.category) + data.transaction.id + "/"
            this.setState({redirect: redirectUrl})
        }
    }
    errorResponse = (errors) => {
        this.setState({errors: errors})
    }

    createTransactionHandler = (event, edit = false) => {
        event.preventDefault()
        let data = this.setUpData(this.state.form_data)
        let url = process.env.REACT_APP_API_ADDRESS + "transactions"
        url += edit === true ? "/" + this.props.transaction.id : ""
        this.submitHandler(event, 
                            url, 
                            data, 
                            this.successResponse, 
                            this.errorResponse, 
                            null,
                            edit)
    }
    hiddenDataHandler = (input) => {
        this.setState({[input.name]: input.value})
    }

    

    static FormElements = (suffix=null, clientCategory, contactPlaceholder, category) => {
        let inputs = {
            amount: {
                inputType: "text",
                name: "amount",
                placeholder: "Monto",
                blank: false
            },
            description: {
                inputType: "textarea",
                name: "description",
                placeholder: "Descripción"
            },
            date: {
                inputType: "date",
                name: "date",
                placeholder: "Fecha",
                blank: false
            },
            category: {
                inputType: "hidden",
                name: "category",
                value: category,
                blank: false
            },
            contact_id: {
                kind: "contact",
                name: "contact_id",
                data: {
                    category: clientCategory
                },
                url: 'contacts',
                search: true,
                placeholder: contactPlaceholder,
                form_elements: NewContact.formElements(clientCategory),
                suffix: "contact.",
                placeholder_suffix: "Nuevo " + contactPlaceholder + ": ",
                child: true,
                blank: ["expense", "revenue"].includes(category)
            },
            project_id: {
                kind: "project",
                name: "project_id",
                url: 'projects',
                search: true,
                data: {},
                placeholder: "Proyecto",
                suffix: "project.",
                form_elements: NewProject.formElements("project."),
                child: true,
                placeholder_suffix: "Nuevo proyecto: ",
            },
            bill_number: {
                inputType: "text",
                name: "bill_number",
                placeholder: "Número de factura"
            }

        }
        return inputs
    }
    
    componentDidMount(){
        // refactor this when have a chance. it is messy
        if (this.props.transaction !== undefined && this.state.transaction !== undefined){
            this.setState({transaction: this.props.transaction})
            this.getPreviousValues(this.props.transaction, "transaction.");
        } else {
            const passed_state = this.props.location.state
            if (passed_state !== undefined && passed_state.contact_id !== undefined){
                this.setState(prevState => {
                    let data = {...prevState.form_data}
                    data["transaction.contact_id"] = passed_state.contact_id
                    return({form_data: data})
                })
            }
            if (passed_state !== undefined && passed_state.project_id !== undefined){
                this.setState(prevState => {
                    let data = {...prevState.form_data}
                    data["transaction.project_id"] = passed_state.project_id
                    return({form_data: data})
                })
            }
            if (passed_state !== undefined && passed_state.parent_id !== undefined){
                this.setState(prevState => {
                    let data = {...prevState.form_data}
                    data["transaction.parent_id"] = passed_state.parent_id
                    return({form_data: data})
                })
            }
        }
    }

    render() {
        // check for redirect
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const contactPlaceholder = (["receivable", "revenue"].includes(this.props.category)?
            ("Cliente") : ("Proveedor"))
        const clientCategory = (["receivable", "revenue"].includes(this.props.category)?
        ("client") : ("provider"))
        let form_elements = NewTransaction.FormElements(null, clientCategory, contactPlaceholder, this.state.category)
        const passed_state = this.props.location.state
        const passed_transaction = this.props.transaction
        let balance = null
        // get values for search inputs if info is passed
        if (passed_state !== undefined ||  passed_transaction !== undefined) {
            if (passed_state !== undefined && passed_state.balance !== undefined) {
                balance = <h2>Saldo restante: ${passed_state.balance.toFixed(2)}</h2>
            }

            let contact_id = passed_transaction !== undefined ? (
                passed_transaction.contact_id
            ) : ( passed_state.contact_id )
            let contact_name = passed_transaction !== undefined ? (
                passed_transaction.contact_name
            ) : ( passed_state.contact_name )
            let project_id = passed_transaction !== undefined ? (
                passed_transaction.project_id
            ) : ( passed_state.project_id )
            let project_name = passed_transaction !== undefined ? (
                passed_transaction.project_name
            ) : ( passed_state.project_name )
            // update search values
            form_elements.contact_id["id"] = contact_id === null ? undefined : contact_id
            form_elements.contact_id["givenName"] =  contact_name === null ? undefined : contact_name
            form_elements.contact_id["edit"] =  passed_transaction !== undefined
            
            form_elements.project_id["id"] =  project_id === null ? undefined : project_id
            form_elements.project_id["givenName"] =  project_name === null ? undefined : project_name
            form_elements.project_id["edit"] =  passed_transaction !== undefined
        }
        let title = ""
        let name = ""
        if (this.props.category === "payable"){
            title = "cuenta por pagar"
            name = "cuenta por pagar"
            title = (this.props.transaction !== undefined ? "Editar " : "Nueva ") + title
        } else if (this.props.category === "receivable") {
            title = "cuenta por cobrar"
            name = "cuenta por cobrar"
            title = (this.props.transaction !== undefined ? "Editar " : "Nueva ") + title
        } else if (this.props.category === "expense") {
            title = "egreso"
            name = "egreso"
            title = (this.props.transaction !== undefined ? "Editar " : "Nuevo ") + title
        } else if (this.props.category === "revenue") {
            title = "ingreso"
            name = "ingreso"
            title = (this.props.transaction !== undefined ? "Editar " : "Nuevo ") + title
        }
        const saveTitle = this.props.transaction !== undefined ? "Guardar" : "Crear"
        // check for remaining balance


        return(
            <div className={classes.NewTransaction}>
                <h1>{title}</h1>
                {balance}
                <div className={classes.FormDiv}>
                    <Form
                        changed={this.changeHandler}
                        submit={this.createTransactionHandler}
                        inputs={form_elements}
                        errors={this.state.errors}
                        suffix={"transaction."} 
                        removeChild={this.removeChildId}
                        clicked={this.clickedAddHandler}
                        submitText={saveTitle}
                        previousValues={this.state.form_data}
                        edit={this.props.transaction !== undefined}
                        old_data={this.state.old_data} />
                </div>
            </div>
        )
    }
}

export default withRouter(NewTransaction)