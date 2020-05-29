import React from 'react';
import Aux from '../../../hoc/Aux/Aux'
import { Route, withRouter, Switch } from 'react-router-dom';
import NewTransaction from './NewTransaction/NewTransaction'
import Transaction from './Transaction/Transaction'
import MonthSelector from '../../../UI/MonthSelector/MonthSelector'
import Getter from '../../../helpers/Getter'
import classes from './Transactions.css'
import UrlContext from '../../../context/url-context'
import TransactionBox from '../../TransactionBox/TransactionBox'
import Summary from './Summary/Summary'
import TransactionIndex from './TransactionIndex/TransactionIndex'
import ExcelButton from '../../../UI/Buttons/ExcelButton/ExcelButton'

class Transactions extends Getter {
    state = {
        transactions: null,
        category: this.props.category,
        yearly: false,
        summary: null,
        month: (new Date).getMonth(),
        year: (new Date).getFullYear(),
    }


    pushQuery = () => {
        let query = ""
        Object.keys(this.state.query).map(key => {
            if (![undefined, null].includes(this.state.query[key])){
                query += ("?"+key+"="+this.state.query[key])
            }
        })
        this.props.history.push({
            pathname: "/transacciones",
            search: query
        })
    }

    getQuery = () => {
        let query = ""
        if (this.state.query !== undefined){
            Object.keys(this.state.query).map(key => {
                if (![undefined, null].includes(this.state.query[key])){
                    query += ("?"+key+"="+this.state.query[key])
                }
            })
        }
        return query
    }

    changedTimeHandler = (month, year) => {
        this.setState({month: month, year: year})
    }

    successHandler = (data) => {
        this.setState({
            transactions: data.transactions,
            summary: data.summary
        })
    }


    errorHandler = () => {
        this.setState({commError: true});
    }
    
    changedYearlyHandle = () => {
        this.setState(prevState => {
            return ({yearly: !prevState.yearly})
        })
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            JSON.stringify(this.state) !== JSON.stringify(nextState) || 
            JSON.stringify(this.props) !== JSON.stringify(nextProps) || 
            this.state.yearly !== nextState.yearly
        )
    }

    getData = () => {
        const data = {
            yearly: this.state.yearly,
            month: this.state.month,
            year: this.state.year,
            category: this.state.category
        }
        return data;
    }

    getUrl = () => {
        return this.context.url + "transactions"
    }

    componentDidMount = () => {
        if (this.state.category === undefined && !this.state.commError){            
            this.getServerInfo(this.getUrl(), this.getData(), this.errorHandler, this.successHandler)
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.category === undefined && !this.state.commError){
            this.getServerInfo(this.getUrl(), this.getData(), this.errorHandler, this.successHandler)
        }
        if(JSON.stringify(prevState) !== JSON.stringify(this.state)){
            this.updateQuery();
        }
    }
    static contextType = UrlContext;
    render(){
        const transactions = this.state.transactions
        const summary = this.state.summary
        const redirect_path = this.props.location.pathname


        const title = ("Resumen" + (this.state.yearly ? " anual" : " mensual"));
        let tranBoxes = null
        if (transactions !== null){
            tranBoxes = (
                Object.keys(this.state.transactions).map(obKey => (
                    <TransactionBox
                        key={this.state.transactions[obKey].id}
                        transactions={this.state.transactions[obKey]}
                        category={obKey}
                        redirect_path={redirect_path}
                        stateToPass={{
                            path: redirect_path
                        }}
                        seeMoreState={{
                            yearly: this.state.yearly,
                            year: this.state.year,
                            month: this.state.month
                        }} />
                ))
            )
        } else {
            tranBoxes = (
                <p>No hay ninguna transacción en el periodo seleccionado.</p>
            )
        }

        const index = this.props.category === undefined ? (
            <div className={classes.Transactions}>
                <h1>{title}</h1>
                <div className={classes.MonthSelector}>
                    <MonthSelector
                        switchedYearly={this.changedYearlyHandle}
                        changeTime={this.changedTimeHandler} />
                </div>
                {summary !== null ? (
                    <div className={classes.Summary}>
                        <Summary   
                            summary={summary} />
                    </div>
                ) : null}

                <ExcelButton   
                    month={this.state.month}
                    year={this.state.year}
                    yearly={this.state.yearly}
                    kind="transactions" />
                <div className={classes.tranBoxes}>
                    {tranBoxes}
                </div>
                
            </div>
        ) : (<TransactionIndex category={this.props.category} />)

        return(
            <Aux>
                <Switch>
                    <Route path={this.props.match.url + "/"} exact>
                        {index}
                    </Route>
                    <Route path={this.props.match.url + "/agregar"} exact render={() => (
                        <NewTransaction category={this.props.category} />
                    )} />
                    <Route path={this.props.match.url + "/:id"} render={() => (
                        <Transaction category={this.props.category} />
                    )} />
                </Switch>
            </Aux>
        )
    }
}

export default withRouter(Transactions);