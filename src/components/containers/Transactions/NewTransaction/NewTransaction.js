import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import classes from './NewTransaction.css';
import FormHolder from '../../../../helpers/FormHolder';
import Form from '../../../Form/Form';
import NewContact from '../../Contacts/NewContact/NewContact';
import NewProject from '../../Projects/NewProject/NewProject';
import AuthContext from '../../../../context/auth-context';
import Transaction from '../Transaction/Transaction';
import LocalizedStrings from 'react-localization';

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
        if (this.state.old_data === {}){
            this.context.setAlerts([
                {title: "Cambios guardados",
                 classes: ["success"],
                 message: null}
            ])
        } else {
            this.context.setAlerts([
                {
                    title: Transaction.createdMessage(this.state.category),
                    classes: ["success"],
                    message: null
                }
            ])
        }
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
        let strings = new LocalizedStrings({
            en:{
                amount: "Amount",
                description: "Description",
                paymentType: "Payment type",
                chequeNumber: "Cheque number",
                date: "Date",
                new: "New ",
                project: "Project",
                billNumber: "Bill number",
                paymentTypes: {
                    cash: "Cash",
                    credit: "Credit",
                    debit: "Debit",
                    cheque: "Cheque",
                    wireTransfer: "Wire transfer"
                }
                
            },
            es: {
                amount: "Monto",
                description: "Descripción",
                paymentType: "Tipo de pago",
                chequeNumber: "Número de cheque",
                date: "Fecha",
                new: "Nuevo ",
                project: "Proyecto",
                billNumber: "Número de factura",
                paymentTypes: {
                    cash: "Efectivo",
                    credit: "Crédito",
                    debit: "Débito",
                    cheque: "Cheque",
                    wireTransfer: "Transferencia bancaria"
                }
            }
           });
          let language = navigator.language;
          if (localStorage.getItem('language') !== null){
              language = JSON.parse(localStorage.getItem('language'));
          } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
              language = JSON.parse(sessionStorage.getItem('language'));
          }
          strings.setLanguage(language)
        let inputs = {
            amount: {
                inputType: "text",
                name: "amount",
                placeholder: strings.amount,
                blank: false
            },
            description: {
                inputType: "textarea",
                name: "description",
                placeholder: strings.description
            },
            payment_type: {
                inputType: "select",
                placeholder: strings.paymentType,
                options: [
                    strings.paymentTypes.cash,
                    strings.paymentTypes.credit,
                    strings.paymentTypes.debit,
                    strings.paymentTypes.cheque,
                    strings.paymentTypes.wireTransfer,
                ],
                name: "payment_type",
                blank: true,
                input: {
                    onOption: 3,
                    inputType: "text",
                    name: "cheque_number",
                    placeholder: strings.chequeNumber,
                    blank: true
                }
            },
            date: {
                inputType: "date",
                name: "date",
                placeholder: strings.date,
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
                placeholder_suffix: strings.new + contactPlaceholder + ": ",
                child: true,
                blank: ["expense", "revenue"].includes(category)
            },
            project_id: {
                kind: "project",
                name: "project_id",
                url: 'projects',
                search: true,
                data: {},
                placeholder: strings.project,
                suffix: "project.",
                form_elements: NewProject.formElements("project."),
                child: true,
                placeholder_suffix: strings.NewProject,
            },
            bill_number: {
                inputType: "text",
                name: "bill_number",
                placeholder: strings.billNumber
            }

        }
        if (["payable", "receivable"].includes(category)){
            delete(inputs.payment_type)
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
        let strings = new LocalizedStrings({
            en:{
                client: "Client",
                provider: "Provider",
                newM: "New ",
                newF: "New ",
                edit: "Edit ",
                revenue: "Revenue",
                accountPayable: "Account payable",
                expense: "Expense",
                accountReceivable: "Account receivable",
                save: "Save",
                create: "Create",
                remainingBalance: "Current balance"

            },
            es: {
                client: "Cliente",
                provider: "Proveedor",
                newM: "Nuevo ",
                newF: "Nueva ",
                edit: "Editar ",
                revenue: "Ingreso",
                accountsayable: "Cuenta por pagar",
                expense: "Egreso",
                accountReceivable: "Cuenta por cobrar",
                save: "Guardar",
                create: "Crear",
                remainingBalance: "Saldo restante"
            }
        });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        strings.setLanguage(language);
        // check for redirect
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const contactPlaceholder = (["receivable", "revenue"].includes(this.props.category)?
            strings.client : strings.provider)
        const clientCategory = (["receivable", "revenue"].includes(this.props.category)?
        ("client") : ("provider"))
        let form_elements = NewTransaction.FormElements(null, clientCategory, contactPlaceholder, this.state.category)
        const passed_state = this.props.location.state
        const passed_transaction = this.props.transaction
        let balance = null
        // get values for search inputs if info is passed
        if (passed_state !== undefined ||  passed_transaction !== undefined) {
            if (passed_state !== undefined && passed_state.balance !== undefined) {
                balance = <h2>{strings.remainingBalance}: ${passed_state.balance.toFixed(2)}</h2>
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
            title = strings.accountPayable
            name = strings.accountPayable
            title = (this.props.transaction !== undefined ? strings.edit : strings.newF) + title
        } else if (this.props.category === "receivable") {
            title = strings.accountReceivable
            name = strings.accountReceivable
            title = (this.props.transaction !== undefined ? strings.edit : strings.newF) + title
        } else if (this.props.category === "expense") {
            title = strings.expense
            name = strings.expense
            title = (this.props.transaction !== undefined ? strings.edit : strings.newM) + title
        } else if (this.props.category === "revenue") {
            title = strings.revenue
            name = strings.revenue
            title = (this.props.transaction !== undefined ? strings.edit : strings.newM) + title
        }
        const saveTitle = this.props.transaction !== undefined ? strings.save : strings.create
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