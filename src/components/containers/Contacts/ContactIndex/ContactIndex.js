import React from 'react';
import Getter from '../../../../helpers/Getter'
import classes from './ContactIndex.css'
import Search from '../../../../UI/Search/Search'
import { Link } from 'react-router-dom'
import LocalizedStrings from 'react-localization';
class ContactIndex extends Getter {
    state = {
        contacts: [],
        search_contacts: []
    }

    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                client: "client",
                provider: "provider",
                clients: "Clients",
                providers: "Providers",
                latest: "Latest ",
                search: "Search for "
            },
            es: {
                client: "cliente",
                provider: "proveedor",
                clients: "Clientes",
                providers: "Proveedores",
                latest: "Ultimos",
                search: "Buscar "
            }
       });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        strings.setLanguage(language)
        return strings;
    }

    errorHandler = () => {
        this.setState({commError: true});
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
        if (!this.state.commError){
            this.getContacts();
        }
    }

    componentDidUpdate = () => {
        if (!this.state.commError){
            this.getContacts();
        }
    }

    render(){

        const placeholder = this.props.category == "client" ? this.strings().client : this.strings().provider
        const searchLink = this.props.category == "client" ? "/clientes/" : "/proveedores/"
        const title = this.props.category == "client" ? this.strings().clients : this.strings().providers
        const contacts = this.state.contacts
        
        const latestClients = contacts.length > 0 ? (
            <div className={classes.latestClients}>
                <div className={classes.title}>
                    <h2>{this.strings().latest}{title}</h2>
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
                        objects={this.state.search_contacts}
                        placeholder={this.strings().search + placeholder}
                        link={searchLink} />
                </div>

                {latestClients}
            </div>
        )
    }
}

export default ContactIndex