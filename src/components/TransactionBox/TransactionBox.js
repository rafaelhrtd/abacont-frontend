import React, {Component} from 'react';
import classes from './TransactionBox.css'
import TransactionBoxItem from './TransactionBoxItem/TransactionBoxItem';
import Button from '../../UI/Buttons/Button/Button'
import AuthContext from '../../context/auth-context'
import { Link } from 'react-router-dom'

// props
// stateToPass : passes a state to the addTransaction button
class TransactionBox extends Component {
    static getTitle = (category) => {

        if (category === undefined) {
            return null
        }
        let title = ""
        if (category === "payable"){
            title = "Cuentas por pagar"
        } else if (category === "receivable") {
            title = "Cuentas por cobrar"
        } else if (category === "expense") {
            title = "Egresos"
        } else if (category === "revenue") {
            title = "Ingresos"
        }
        return title
    }
    static contextType = AuthContext;

    state = {
        transactions: {},
        category: null,
        title: null,
        contactCategory: null
    }

    componentDidMount = () => {
        this.setState({
            transactions: this.props.transactions,
            category: this.props.category,
            contactCategory: this.props.contactCategory
        })
        this.setState({title: TransactionBox.getTitle(this.props.category)})
    }
    shouldComponentUpdate(nextProps, nextState){
        return (
            JSON.stringify(this.state) !== JSON.stringify(nextState) || 
            JSON.stringify(this.props) !== JSON.stringify(nextProps)
        )
    }
    componentDidUpdate = () => {
        this.setState({
            transactions: this.props.transactions,
            category: this.props.category,
            contactCategory: this.props.contactCategory,
            title: TransactionBox.getTitle(this.props.category)
        })
    }


    
    render(){
        const contactCategory = this.state.contactCategory
        const dynamicClasses = ["payable", "receivable"].includes(this.state.category) ? "yellowbg" : "greenbg"
        if (this.state.transactions === null 
            || (["payable", "expense"].includes(this.state.category) && contactCategory == "client")
            || (["receivable", "revenue"].includes(this.state.category) && contactCategory == "provider")) {
            return null
            

        } else {
            let transactionsURL = ""
            const category = this.state.category 
            if (category === "payable"){
                transactionsURL = "/cuentas-por-pagar/"
            } else if (category === "receivable") {
                transactionsURL = "/cuentas-por-cobrar/"
            } else if (category === "expense") {
                transactionsURL = "/egresos/"                
            } else if (category === "revenue") {
                transactionsURL = "/ingresos/"
            }

            // url to create new transaction
            let newTransactionURL = transactionsURL + "agregar"

            let seeMoreButton = !this.props.noSeeMore && this.state.transactions.length !== 0 ? (
                <Link to={{
                        pathname: transactionsURL,
                        state: this.props.seeMoreState}}>
                    <Button className="primary">Ver más</Button>
                </Link>
            ) : null
            
            return (
                <div className={classes.TransactionBox}>
                    {this.props.noTitle ? null : (
                        <h2 className={classes[dynamicClasses]}>{this.state.title}</h2>
                    )}
                    <div className={classes.Transactions}>
                        {Object.keys(this.state.transactions).map(key => (
                            <TransactionBoxItem 
                                transaction={this.state.transactions[key]}
                                key={this.state.transactions[key].id}
                                inContact={this.props.inContact}
                                redirect_path={this.props.redirect_path}
                                stateToPass={this.props.stateToPass} />
                        ))}
                    </div>
                    {seeMoreButton}
                    {this.context.user.can_write ? (
                        <Link to={{
                            pathname: newTransactionURL,
                            state: this.props.stateToPass}}>
                            <Button className="success">Agregar</Button>
                        </Link>
                    ) : null }
                </div>
            )
        }
    }
}

export default TransactionBox;