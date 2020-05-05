import React from 'react';
import classes from './Transaction.css';
import Getter from '../../../../helpers/Getter'
import { Route, withRouter, Switch } from 'react-router-dom';
import TransactionInfo from './TransactionInfo/TransactionInfo'
import TransactionBox from '../../../TransactionBox/TransactionBox'
import NewTransaction from '../NewTransaction/NewTransaction'


class Transaction extends Getter {
    state = {
        transaction: null,
        children: {},
        id: this.props.match.params.id,
        category: this.props.category
    }

    errorHandler = (errors) => {
        console.log(errors);
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
        console.log("rendering")
        const url = "http://localhost:3000/transactions/" + this.state.id
        this.getServerInfo(url, null, this.errorHandler, this.successHandler)
        const children = this.state.children
        let title = ""
        let childrenTitle = ""
        const category = this.state.category
        let childCategory = ""
        if (category === "receivable"){
            title = "Cuenta por cobrar"
            childrenTitle = "Ingresos"
            childCategory = "revenue"
        } else if (category === "payable"){
            childCategory = "expense"
            title = "Cuenta por pagar"
            childrenTitle = "Egresos"
        } else if (category === "revenue"){
            title = "Ingreso"
        } else if (category === "expense"){
            title = "Egreso"
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
                                redirect_path={this.props.location.pathname}
                                stateToPass={{
                                    contact_id: this.state.transaction.contact_id,
                                    contact_name: this.state.transaction.contact_name,
                                    redirect_path: this.props.location.pathname,
                                    parent_id: this.state.transaction.id
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