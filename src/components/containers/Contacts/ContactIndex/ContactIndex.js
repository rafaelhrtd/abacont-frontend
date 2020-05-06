import React from 'react';
import Getter from '../../../../helpers/Getter'
import classes from './ContactIndex.css'
import Search from '../../../../UI/Search/Search'
import { Link } from 'react-router-dom'
class ContactIndex extends Getter {
    state = {
        contacts: [],
        search_contacts: []
    }

    errorHandler = (data) => {
        console.log(data)
    }

    successHandler = (data) => {
        this.setState({
            contacts: data.contacts,
            search_contacts: data.objects
        })
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return(
            JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
                 JSON.stringify(nextState) != JSON.stringify(this.state)
        )
    }

    getContacts = () => {
        const data = {
            category: this.props.category
        }
        const url = process.env.REACT_APP_API_ADDRESS + "contacts/"
        this.getServerInfo(url, data, this.errorHandler, this.successHandler)
    }

    componentDidMount = () => {
        this.getContacts();
    }

    componentDidUpdate = () => {
        this.getContacts();
    }

    render(){

        const placeholder = this.props.category == "client" ? "cliente" : "proveedor"
        const searchLink = this.props.category == "client" ? "/clientes/" : "/proveedores/"
        const title = this.props.category == "client" ? "Clientes" : "Proveedores"
        const contacts = this.state.contacts

        console.log("ful")
        console.log(contacts)
        
        const latestClients = contacts.length > 0 ? (
            <div className={classes.latestClients}>
                <div className={classes.title}>
                    <h2>Últimos {title}</h2>
                </div>
                {
                    contacts.map(contact => (
                        <Link to={searchLink + contact.id}>
                            <div className={classes.Item}>
                                    <div className={classes.name}>
                                        {contact.name}
                                    </div>
                                    <div className={classes.name}>
                                        ${contact.balance.toFixed(2)}
                                    </div>
                            </div>
                        </Link>

                    ))
                }
            </div>
        ) : null

        return(
            <div className={classes.ContactIndex}>
                <h1>{title}</h1>
                <div className={classes.Search}>
                    <Search 
                        objects={this.state.contacts}
                        placeholder={"Buscar " + placeholder}
                        link={searchLink} />
                </div>

                {latestClients}
            </div>
        )
    }
}

export default ContactIndex