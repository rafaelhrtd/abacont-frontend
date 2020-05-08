import React from 'react';
import classes from './Contact.css';
import Getter from '../../../../helpers/Getter'
import { Route, withRouter, Switch } from 'react-router-dom';
import ContactInfo from './ContactInfo/ContactInfo'
import TransactionBox from '../../../TransactionBox/TransactionBox'
import NewContact from '../NewContact/NewContact'

class Contact extends Getter {
    state = {
        contact: null,
        transactions: {},
        id: this.props.match.params.id
    }
    errorHandler = (errors) => {
        console.log(errors);
    }
    successHandler = (data) => {
        this.setState({
            contact: data.contact,
            transactions: data.transactions
        }) //should also get transactions here once they are set up
    }

    shouldComponentUpdate = (nextProps, nextState) =>{
        return JSON.stringify(this.state) !== JSON.stringify(nextState) || 
            JSON.stringify(this.props) !== JSON.stringify(nextProps)
    }

    componentWillUnmount = () => {
        console.log("Unmounting")
    }

    componentDidMount = () => {
        const url = process.env.REACT_APP_API_ADDRESS + "contacts/" + this.state.id
        this.getServerInfo(url, null, this.errorHandler, this.successHandler)
    }
    componentDidUpdate = () => {
        const url = process.env.REACT_APP_API_ADDRESS + "contacts/" + this.state.id
        this.getServerInfo(url, null, this.errorHandler, this.successHandler)
    }

    render() {
        let redirect_path = ""
        if (this.state.contact !== null){
            redirect_path = this.state.contact.category === "client" ? "/clientes/" : "/proveedores/"
            redirect_path += this.state.contact.id
            return(
                <Switch>
                    <Route path={this.props.match.url + "/"} exact render={() => (
                        <div className={classes.Contact}>
                            {this.state.contact === null ? 
                                (
                                    // todo add redirect when not found
                                    null
                                ):(
                                    <h1>{this.state.contact.name}</h1>
                                )}
                            <ContactInfo
                                contact={this.state.contact}
                                />
                            { Object.keys(this.state.transactions).map(obKey => (
                                <TransactionBox
                                    key={this.state.transactions[obKey].id}
                                    transactions={this.state.transactions[obKey]}
                                    inContact={true}
                                    category={obKey}
                                    contactCategory={this.state.contact.category}
                                    redirect_path={redirect_path}
                                    stateToPass={{
                                        contact_id: this.state.contact.id,
                                        contact_name: this.state.contact.name,
                                        redirect_path: redirect_path
                                    }}
                                    seeMoreState={{
                                        contact_id: this.state.id
                                    }} />
                            ))}
    
                        </div>
                    )} />
                    <Route path={this.props.match.url + "/editar"} exact render={() => (
                        <NewContact 
                            category={this.state.category}
                            contact={this.state.contact}
                            redirect_url={redirect_path} />
                    )} />
                </Switch>
            )
        } else {return null}
    }
    
}

export default withRouter(Contact);