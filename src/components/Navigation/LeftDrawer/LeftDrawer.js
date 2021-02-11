import React from 'react';
import classes from './LeftDrawer.css'
import Backdrop from '../../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/Aux/Aux'
import { NavLink } from 'react-router-dom'
import HR from '../../../UI/HR/HR';
import Logo from '../../../assets/images/logo-big.svg';
import LocalizedStrings from 'react-localization';

const leftDrawer = (props) => {
    let strings = new LocalizedStrings({
      en:{
        finance: "Finance",
        summary: "Summary",
        revenues: "Revenues",
        accountsPayable: "Accounts payable",
        expenses: "Expenses",
        accountsReceivable: "Accounts receivable",
        projects: "Projects",
        contacts: "Contacts",
        clients: "Clients",
        providers: "Providers"
      },
      es: {
        finance: "Finanzas",
        summary: "Resumen",
        revenues: "Ingresos",
        accountsPayable: "Cuentas por pagar",
        expenses: "Egresos",
        accountsReceivable: "Cuentas por cobrar",
        projects: "Proyectos",
        contacts: "Contactos",
        clients: "Clientes",
        providers: "Proveedores"
      }
     });
    let language = navigator.language;
    if (localStorage.getItem('language') !== null){
        language = JSON.parse(localStorage.getItem('language'));
    } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
        language = JSON.parse(sessionStorage.getItem('language'));
    } 
            language = language ? language : "en"
        strings.setLanguage(language);

    let attachedClasses = [classes.LeftDrawer, classes.Closed]
    if (props.open) {
        attachedClasses = [classes.LeftDrawer, classes.Open]
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.backDropHandler} />
            <div className={attachedClasses.join(" ")}>
                <div className={classes.Logo}>
                    <img src={Logo} alt="React Logo" /> 
                </div>
                <h2>{strings.finance}</h2>
                <HR />
                <ul>
                    <li>
                        <NavLink to="/" onClick={props.backDropHandler}>
                            {strings.summary}
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/ingresos" onClick={props.backDropHandler}>
                            {strings.revenues}
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/cuentas-por-pagar" onClick={props.backDropHandler}>
                            {strings.accountsPayable}
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/egresos" onClick={props.backDropHandler}>
                            {strings.expenses}
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/cuentas-por-cobrar" onClick={props.backDropHandler}>
                            {strings.accountsReceivable}
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/proyectos" onClick={props.backDropHandler}>
                            {strings.projects}
                        </NavLink> 
                    </li>
                </ul>
                <h2>{strings.contacts}</h2>
                <HR />
                <ul>
                <li>
                        <NavLink to="/clientes" onClick={props.backDropHandler}>
                            {strings.clients}
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/proveedores" onClick={props.backDropHandler}>
                            {strings.providers}
                        </NavLink> 
                    </li>
                </ul>
            </div>
        </Aux>
    )
}

export default leftDrawer