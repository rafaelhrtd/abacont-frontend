import React from 'react';
import Getter from '../../../../helpers/Getter';
import { withRouter } from 'react-router-dom';
import MonthSelector from '../../../../UI/MonthSelector/MonthSelector';
import TransactionBox from '../../../TransactionBox/TransactionBox'
import classes from './TransactionIndex.css';
import Transaction from '../Transaction/Transaction'
import PageSelector from '../../../../UI/PageSelector/PageSelector'

class TransactionIndex extends Getter {
    state = {
        category: null,
        title: null,
        month: (new Date).getMonth(),
        year: (new Date).getFullYear(),
        yearly: false,
        page: 1,
        query: {},
        transactions: {}
    }
    
    componentDidMount = () => {
        const passedState = this.props.location.state
        const query = {...this.parseQuery()}
        const passedMonth = passedState === undefined || passedState === null  ? undefined : passedState.month
        const passedYear = passedState === undefined || passedState === null ? undefined : passedState.year
        const passedYearly = passedState === undefined || passedState === null ? undefined : passedState.yearly
        console.log(query)
        this.setState({
            passedState: passedState,
            category: this.props.category,
            title: TransactionBox.getTitle(this.props.category),
            ...this.parseQuery(),
            query: query,
            contact_id: passedState === undefined || passedState === null ? query.contact_id : passedState.contact_id,
            parent_id: passedState === undefined || passedState === null ? query.parent_id : passedState.parent_id,
            project_id: passedState === undefined || passedState === null ? query.project_id : passedState.project_id,
            month: passedMonth === undefined ? (new Date).getMonth() : passedMonth,
            year: passedYear === undefined ? (new Date).getFullYear() : passedYear,
            yearly: passedYearly === undefined ? false : passedYearly
        }, () => {
            this.updateQuery()
        })
    }
    
    changedYearlyHandle = () => {
        this.setState(prevState => {
            return ({yearly: !prevState.yearly,
                     page: 1})
        })
    }

    getUrl = () => {
        return (process.env.REACT_APP_API_ADDRESS + "transactions")
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(JSON.stringify(prevState) !== JSON.stringify(this.state)){
            this.updateQuery();
        }
    }

    pushQuery = () => {
        let query = ""
        Object.keys(this.state.query).map(key => {
            if (![undefined, null].includes(this.state.query[key])){
                query += ("?"+key+"="+this.state.query[key])
            }
        })
        this.props.history.push({
            pathname: Transaction.getUrl(this.props.category).slice(0, -1),
            search: query
        })
    }


    changeTime = (month, year) => {
        this.setState({
            month: month,
            year: year
        })
    }

    changePage = (page) => {
        if (page > 0 && page <= this.state.totalPages){
            this.setState({page: page})
        }
    }

    successHandler = (data) => {
        this.setState({
            transactions: data.transactions,
            totalPages: data.total_pages
        })
    }

    errorHandler = (data) => {
        console.log(data)
    }

    render(){
        return(
            <div className={classes.TransactionIndex}>
                <h1>{this.state.title}</h1>
                <MonthSelector
                    month={this.state.month}
                    year={this.state.year}
                    changeTime={this.changeTime}
                    switchedYearly={this.changedYearlyHandle}
                    yearly={this.state.yearly} />
                <PageSelector
                    page={this.state.page}
                    totalPages={this.state.totalPages}
                    changePageHandler={this.changePage} />
                
                <TransactionBox
                    transactions={this.state.transactions}
                    stateToPass={{
                        path: this.props.location.pathname,
                        query: this.props.location.search
                    }}
                    noTitle={true}
                    category={this.state.category}
                    noSeeMore={true} />
            </div>
        )
    }
}

export default withRouter(TransactionIndex);