import React, { Component } from 'react';
import classes from './TransactionBoxItem.css';
import Aux from '../../../hoc/Aux/Aux';
import AuthContext from '../../../context/auth-context'
import Button from '../../../UI/Buttons/Button/Button'
import { Link } from 'react-router-dom';
import DeleteButton from '../../../UI/Buttons/DeleteButton/DeleteButton';
import LocalizedStrings from 'react-localization';

class TransactionBoxItem extends Component {
    state = {
        transaction: this.props.transaction,
        category: this.props.transaction.category,
        show: false
    }
    static contextType = AuthContext;

    clickedHead = () => {
        this.setState(prevState => {
            return({show: !prevState.show})
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        return (
            JSON.stringify(this.state) !== JSON.stringify(nextState) || 
            JSON.stringify(this.props) !== JSON.stringify(nextProps)
        )
    }
    componentDidMount = () => {
        let redirect_url = this.props.stateToPass.path
        if (this.props.stateToPass.query !== undefined){
            redirect_url += this.props.stateToPass.query
        }
        this.setState({
            redirect_url: redirect_url
        })
    }
    render(){
        const transaction = this.state.transaction
        const category = this.state.category
        const properAmount = ["payable", "receivable"].includes(this.state.category) ? "balance" : "amount"
        
        let date = transaction.date.split("-")
        date = date[2] + "-" +  date[1]
        // declare the things outside of if statement
        let description = null;
        let initialAmount = null;
        let contact = null;
        let buttons = null;
        let contactName = null;
        let project = null;
        let paymentUrl = null;
        let paymentMethod = null;
        let chequeNumber = null; 
        let editURL = null;
        let paymentState = {};



        let strings = new LocalizedStrings({
            en:{
                summary: "Summary",
                edit: "Edit",
                date: "Date:",
                project: "Project:",
                client: "Client:",
                provider: "Provider:",
                chequeNumber: "Cheque number:",
                amount: "Amount:",
                payments: "Payments",
                newPayment: "New payment",
                paymentMethod: "Payment method:",
                currentBalance: "Current balance:"
            },
            es: {
                summary: "Resumen",
                edit: "Editar",
                date: "Fecha:",
                project: "Proyecto:",
                client: "Cliente:",
                provider: "Proveedor:",
                amount: "Monto:",
                chequeNumber: "Número de cheque:",
                payments: "Pagos",
                newPayment: "Nuevo pago",
                paymentMethod: "Método de pago:",
                currentBalance: "Saldo actual:"
            }
        });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        }


        // build transaction info
        if (transaction !== null){        
            let transactionURLComponent = ""
            const contactUrlComponent = ["receivable", "revenue"].includes(this.state.category) ? "/clientes/" : "/proveedores/"
            const contactWord = ["receivable", "revenue"].includes(this.state.category) ? strings.client : strings.provider
            if (category === "payable"){
                transactionURLComponent = "/cuentas-por-pagar/"
            } else if (category === "receivable") {
                transactionURLComponent = "/cuentas-por-cobrar/"
            } else if (category === "expense") {
                transactionURLComponent = "/egresos/"
            } else if (category === "revenue") {
                transactionURLComponent = "/ingresos/"
            }
            // url to edit the transaction
            const transactionURL = transactionURLComponent + transaction.id 
            editURL = transactionURL + "/editar"
            // transaction description
            description = transaction.description !== null ? (
                <div className={classes.description}>
                    <p>{transaction.description}</p>
                </div>
                ) : null
            // get initial amount if the transaction is a debt
            initialAmount = properAmount === "balance" ? (
                <div className={classes.initialAmount}>
                    <strong>Monto:</strong>
                    ${transaction.amount.toFixed(2)}
                </div>
            ) : null
            
            // contact info
            if (!this.props.inContact && transaction.contact_id !== null) {
                const contactUrl = contactUrlComponent + transaction.contact_id
                contact = (
                    <div className={classes.contact}>
                        <strong>{contactWord}</strong>
                        <Link to={contactUrl}>{transaction.contact_name}</Link>
                    </div>
                )
            } else {
                contact = null
            }

            // contact name
            if (!this.props.inContact && transaction.contact_id !== null) {
                contactName = (
                    <div className={classes.contactName}>
                        {transaction.contact_name}
                    </div>
                )
            } else {
                contactName = null
            }
            // payment url
            if (properAmount === "balance"){
                paymentUrl = this.state.category === "receivable" ? "/ingresos/" : "/egresos/"
                paymentUrl += "agregar"
                paymentState["contact_id"] = this.state.transaction.contact_id
                paymentState["contact_name"] = this.state.transaction.contact_name
                paymentState["project_id"] = this.state.transaction.project_id
                paymentState["project_name"] = this.state.transaction.project_name
                paymentState["parent_id"] = this.state.transaction.id
                paymentState["path"] = this.props.stateToPass.path
                paymentState["balance"] = this.state.transaction.balance
            }
            // transaction info and edit
            buttons = (
                <div className={classes.Buttons}>
                    {properAmount === "balance" ? (
                        <Aux>
                            <Link to={transactionURL}>   
                                <Button className="primary"
                                    link={transactionURL}>
                                    {strings.payments}
                                </Button>
                            </Link>
                            <Link to={{
                                pathname: paymentUrl,
                                state: paymentState
                            }}> 
                                {this.context.user.can_write ? (
                                    <Button className="success">
                                        {strings.newPayment}
                                    </Button>
                                ) : null}  
                            </Link>
                        </Aux>
                    ) : null }
                    { this.context.user.can_edit ? (
                        <Aux>
                            <Link to={{
                                pathname: editURL,
                                state: {
                                    path: this.state.redirect_url
                                }
                            }}>   
                                <Button className="warning">
                                    {strings.edit}
                                </Button>
                            </Link>
                            <DeleteButton 
                                object={{transaction: transaction}}
                                redirectPath={this.props.stateToPass.path} />
                        </Aux>
                    ) : null}
                </div>
            )

            // project 
            if (transaction.project_id !== null) {
                const projectUrl = "/proyectos/" + transaction.project_id
                project = (
                    <div className={classes.contact}>
                        <strong>{strings.project}</strong>
                        <Link to={projectUrl}>{transaction.project_name}</Link>
                    </div>
                )
            } else {
                project = null
            }

            // payment info
            if (transaction.payment_type !== null) {
                paymentMethod = (
                    <div className={classes.contact}>
                        <strong>{strings.paymentMethod}</strong>
                        <p>{transaction.payment_type}</p>
                    </div>
                )
            }
            if (transaction.payment_type === "Cheque" && transaction.cheque_number !== null) {
                chequeNumber = (
                    <div className={classes.contact}>
                        <strong>{strings.chequeNumber}</strong>
                        <p>{transaction.cheque_number}</p>
                    </div>
                )
            }
        }
        // shown class
        const show = this.state.show ? "show" : "hidden"
        const selected = this.state.show ? "selected" : null
        if (transaction !== null){
            return(
                <Aux>
                    <div className={[classes.itemHolder, classes[selected]].join(" ")} onClick={this.clickedHead}>
                        <div className={classes.amount}>{"$" + transaction[properAmount].toFixed(2)}</div>
                        {contactName}
                        <div className={classes.date}>{date}</div>
                    </div>
                    <div className={[classes.itemInfo, classes[show]].join(" ")}>
                        {description}
                        {paymentMethod}
                        {chequeNumber}
                        {project}
                        {contact}
                        {initialAmount}
                        {buttons}
                    </div>
                </Aux>
            )
        } else {
            return null
        }
    }
}

export default TransactionBoxItem