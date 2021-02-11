import React, { useContext } from 'react';
import classes from './TransactionInfo.css'
import { Link } from 'react-router-dom'
import Button from '../../../../../UI/Buttons/Button/Button'
import InfoPoint from '../../../../InfoPoint/InfoPoint'
import DeleteButton from '../../../../../UI/Buttons/DeleteButton/DeleteButton';
import AuthContext from '../../../../../context/auth-context';
import LocalizedStrings from 'react-localization';

const transactionInfo = (props) => {


    let strings = new LocalizedStrings({
        en:{
            summary: "Summary",
            edit: "Edit",
            date: "Date:",
            project: "Project:",
            client: "Client:",
            provider: "Provider:",
            amount: "Amount:",
            paymentMethod: "Payment method:",
            currentBalance: "Current balance:"
        },
        es: {
            summary: "Resumen",
            edit: "Editar",
            date: "Fecha:",
            project: "Proyecto:",
            client: "Cliente:",
            provider: "Proveedor:",
            amount: "Monto:",
            paymentMethod: "Método de pago:",
            currentBalance: "Saldo actual:"
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
        
    const user = useContext(AuthContext).user;

    if (props.transaction === null) {
        return null
    } else {
        const transaction = props.transaction
        let date = transaction.date.split("-")
        date = date[1] + "-" +  date[2]
        let contactUrl = transaction.category === "receivable" ? "/clientes/" : "/proveedores/"
        let transactionUrl = transaction.category === "receivable" ? "/cuentas-por-cobrar/" : "/cuentas-por-pagar/"
        contactUrl += transaction.contact_id
        let projectURL = transaction.project_id !== null ? "/proyectos/" + transaction.project_id : null

        let editURL = transactionUrl + transaction.id + "/editar"
        
        let buttons = user.can_edit ? (
            <div className={classes.buttons}>
                <Link to={{
                    pathname: editURL,
                    state: {transaction: props.transaction}
                }}>
                    <Button className="warning">
                        {strings.edit}
                    </Button>
                </Link>
                <DeleteButton 
                    object={{transaction: props.transaction}}
                    redirectPath={transactionUrl} />
            </div>
        ) : null
        

        return(
            <div className={classes.TransactionInfo}>
                <div className={classes.InfoBox}>
                    <h2>{strings.summary}:</h2>
                    <InfoPoint 
                        title={strings.date}
                        value={date}
                        />

                    <InfoPoint 
                        title={strings.project}
                        value={transaction.project_name}
                        link={projectURL}
                        />

                    <InfoPoint 
                        title={props.transaction.category === "receivable" ? strings.client : strings.provider}
                        value={transaction.contact_name}
                        link={contactUrl}
                        />
                        

                    <InfoPoint 
                        title={strings.amount}
                        value={"$"+props.transaction.amount.toFixed(2)}
                    />

                    <InfoPoint 
                        title={strings.paymentMethod}
                        value={props.transaction.payment_method}
                        />

                    <InfoPoint 
                        title={strings.currentBalance}
                        value={"$"+props.transaction.balance.toFixed(2)}
                        />
                </div>
                {buttons}
            </div>
        )
    }
}

export default transactionInfo