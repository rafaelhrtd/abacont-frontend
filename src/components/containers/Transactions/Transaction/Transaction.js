import React from 'react';
import classes from './Transaction.css';
import Getter from '../../../../helpers/Getter'
import { Route, withRouter, Switch } from 'react-router-dom';
import TransactionInfo from './TransactionInfo/TransactionInfo';
import TransactionBox from '../../../TransactionBox/TransactionBox';
import NewTransaction from '../NewTransaction/NewTransaction';
import LocalizedStrings from 'react-localization';


class Transaction extends Getter {
    state = {
        transaction: null,
        children: {},
        id: this.props.match.params.id,
        category: this.props.category
    }



    errorHandler = () => {
        this.setState({commError: true});
    }

    static getUrl = (category) => {
        switch(category){
            case "receivable":
                return "/cuentas-por-cobrar/"
            case "payable":
                return "/cuentas-por-pagar/"
            case "expense":
                return "/egresos/"
            case "revenue":
                return "/ingresos/"
        }
    }


    static createdMessage = (category) => {

        let strings = new LocalizedStrings({
            en:{
                revenueCreated: "Revenue created.",
                accountPayableCreated: "Account payable created.",
                expenseCreated: "Expense created.",
                accountReceivableCreated: "Account receivable created."
            },
            es: {
                revenueCreated: "Ingreso creado.",
                accountPayableCreated: "Cuenta por pagar creada.",
                expenseCreated: "Egreso creado.",
                accountReceivableCreated: "Cuenta por cobrar creada."
            }
           });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        }
        switch(category){
            case "receivable":
                return strings.accountReceivableCreated
            case "payable":
                return strings.accountPayableCreated
            case "expense":
                return strings.expenseCreated
            case "revenue":
                return strings.revenueCreated
        }
    }



    successHandler = (data) => {
        this.setState({
            transaction: data.transaction,
            children: data.children
        }) //should also get transactions here once they are set up
    }

    shouldComponentUpdate = (nextProps, nextState) =>{
        return JSON.stringify(this.state) !== JSON.stringify(nextState) || 
            JSON.stringify(this.props) !== JSON.stringify(nextProps)
    }
    
    render() {

        let strings = new LocalizedStrings({
            en:{
                revenues: "Revenues",
                accountsPayable: "Accounts payable",
                expenses: "Expenses",
                accountsReceivable: "Accounts receivable",
                revenue: "Revenue",
                accountPayable: "Account payable",
                expense: "Expense",
                accountReceivable: "Account receivable"
            },
            es: {
                revenues: "Ingresos",
                accountsPayable: "Cuentas por pagar",
                expenses: "Egresos",
                accountsReceivable: "Cuentas por cobrar",
                revenue: "Ingreso",
                accountsayable: "Cuenta por pagar",
                expense: "Egreso",
                accountReceivable: "Cuenta por cobrar"
            }
        });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        }

        if (this.state.commError){
            return null
        }
        const url = process.env.REACT_APP_API_ADDRESS + "transactions/" + this.state.id
        this.getServerInfo(url, null, this.errorHandler, this.successHandler)
        const children = this.state.children
        let title = ""
        let childrenTitle = ""
        const category = this.state.category
        let childCategory = ""
        if (category === "receivable"){
            title = strings.accountReceivable
            childrenTitle = strings.revenues
            childCategory = "revenue"
        } else if (category === "payable"){
            childCategory = "expense"
            title = strings.accountPayable
            childrenTitle = strings.expenses
        } else if (category === "revenue"){
            title = strings.revenue
        } else if (category === "expense"){
            title = strings.expense
        }



        if (this.state.transaction !== null){
            return(
                <Switch>
                    <Route path={this.props.match.url + "/"} exact render={() => (
                        <div className={classes.Transaction}>
                        { this.state.transaction === null ? (
                            null
                        ) : (
                            
                            <h1>{title}</h1>
                        )}
                            <TransactionInfo
                                transaction={this.state.transaction}
                                redirect_path={this.props.location.pathname} />
                            <TransactionBox 
                                transactions={children}
                                title={childrenTitle}
                                category={childCategory}
                                stateToPass={{
                                    contact_id: this.state.transaction.contact_id,
                                    contact_name: this.state.transaction.contact_name,
                                    project_id: this.state.transaction.project_id,
                                    project_name: this.state.transaction.project_name,
                                    path: this.props.location.pathname,
                                    parent_id: this.state.transaction.id,
                                    balance: this.state.transaction.balance
                                }}
                                seeMoreState={{
                                    parent_id: this.state.id
                                }} />
                        </div>
                    )} />
                    <Route path={this.props.match.url + "/editar"} exact render={() => (
                        <NewTransaction 
                            category={this.state.category}
                            transaction={this.state.transaction} />
                    )} />
                </Switch>
            )
        } else {
            return null
        }
    }
    
}

export default withRouter(Transaction);