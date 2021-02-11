import React from "react";
import classes from "./Summary.css";
import LocalizedStrings from 'react-localization';

const summary = (props) => {
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
        providers: "Providers",
        expectedBalance: "Expected balance"
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
        providers: "Proveedores",
        expectedBalance: "Total esperado"
      }
     });
     
    let language = navigator.language;
    if (localStorage.getItem('language') !== null){
        language = JSON.parse(localStorage.getItem('language'));
    } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
        language = JSON.parse(sessionStorage.getItem('language'));
    } 
    language = language ? language : "en"
    strings.setLanguage(language)
    let attachedClasses = [classes.LeftDrawer, classes.Closed]
    if (props.open) {
        attachedClasses = [classes.LeftDrawer, classes.Open]
    }
    const expected_total = (
        props.summary.receivable
        + props.summary.revenue
        - props.summary.payable
        - props.summary.expense
    )
    return(
        <div className={classes.Summary}>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.greenbg].join(" ")}><strong>{strings.revenues}:</strong></div>
                <div className={classes.Value}>${props.summary.revenue.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.greenbg].join(" ")}><strong>{strings.accountsReceivable}:</strong></div>
                <div className={classes.Value}>${props.summary.receivable.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.redbg].join(" ")}><strong>{strings.expenses}:</strong></div>
                <div className={classes.Value}>${props.summary.expense.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.redbg].join(" ")}><strong>{strings.accountsPayable}:</strong></div>
                <div className={classes.Value}>${props.summary.payable.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.greenbg].join(" ")}><strong>{strings.expectedBalance}:</strong></div>
                <div className={classes.Value}>${expected_total.toFixed(2)}</div>
            </div>
        </div>
    )
}

export default summary
