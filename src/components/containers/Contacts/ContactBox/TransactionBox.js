import React, {Component} from 'react';
import classes from './TransactionBox.css'
import TransactionBoxItem from './ContactBox/TransactionBoxItem';
import Button from '../../UI/Buttons/Button/Button';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
// props
// stateToPass : passes a state to the addTransaction button
class TransactionBox extends Component {
    getTitle = (category) => {

        let strings = new LocalizedStrings({
            en:{
              revenues: "Revenues",
              accountsPayable: "Accounts payable",
              expenses: "Expenses",
              accountsReceivable: "Accounts receivable",
              seeMore: "See more",
              new: "New"
            },
            es: {
              revenues: "Ingresos",
              accountsPayable: "Cuentas por pagar",
              expenses: "Egresos",
              accountsReceivable: "Cuentas por cobrar",
              providers: "Proveedores",
              seeMore: "Ver más",
              new: "Agregar"
            }
           });
           let language = navigator.language;
           if (localStorage.getItem('language') !== null){
               language = JSON.parse(localStorage.getItem('language'));
           } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
               language = JSON.parse(sessionStorage.getItem('language'));
           }
           strings.setLanguage(language)

        if (category === undefined) {
            return null
        }
        let title = ""
        if (category === "payable"){
            title = strings.accountsPayable
        } else if (category === "receivable") {
            title = strings.accountsReceivable
        } else if (category === "expense") {
            title = strings.expenses
        } else if (category === "revenue") {
            title = strings.revenues
        }
        return title
    }

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
            contactCategory: this.props.contactCategory
        })
    }


    
    render(){
        let strings = new LocalizedStrings({
            en:{
              seeMore: "See more",
              new: "New"
            },
            es: {
              seeMore: "Ver más",
              new: "Agregar"
            }
           });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        strings.setLanguage(language)
        
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
                transactionsURL = "/cuentas-por-pagar"
            } else if (category === "receivable") {
                transactionsURL = "/cuentas-por-cobrar"
            } else if (category === "expense") {
                transactionsURL = "/egresos"                
            } else if (category === "revenue") {
                transactionsURL = "/ingresos"
            }

            // url to create new transaction
            let newTransactionURL = transactionsURL + "agregar"

            let seeMoreButton = this.state.transactions.length !== 0 ? (
                <Link to={transactionsURL}>
                    <Button className="primary">{strings.seeMore}</Button>
                </Link>
            ) : null
            
            return (
                <div className={classes.TransactionBox}>
                    <h2 className={classes[dynamicClasses]}>{this.state.title}</h2>
                    {Object.keys(this.state.transactions).map(key => (
                        <TransactionBoxItem 
                            transaction={this.state.transactions[key]}
                            key={this.state.transactions[key].id}
                            inContact={this.props.inContact}
                            redirect_path={this.props.redirect_path}
                            stateToPass={this.props.stateToPass} />
                    ))}
                    {seeMoreButton}
                    <Link to={{
                        pathname: newTransactionURL,
                        state: this.props.stateToPass}}>
                        <Button className="success">{strings.new}</Button>
                    </Link>
                </div>
            )
        }
    }
}

export default TransactionBox;