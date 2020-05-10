import React from 'react';
import classes from './TransactionInfo.css'
import { Link } from 'react-router-dom'
import Button from '../../../../../UI/Buttons/Button/Button'
import InfoPoint from '../../../../InfoPoint/InfoPoint'
import DeleteButton from '../../../../../UI/Buttons/DeleteButton/DeleteButton'

const transactionInfo = (props) => {
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
        
        let buttons = (
            <div className={classes.buttons}>
                <Link to={{
                    pathname: editURL,
                    state: {transaction: props.transaction}
                }}>
                    <Button className="warning">
                        Editar
                    </Button>
                </Link>
                <DeleteButton 
                    object={{transaction: props.transaction}}
                    redirectPath={transactionUrl} />
            </div>
        )
        

        return(
            <div className={classes.TransactionInfo}>
                <div className={classes.InfoBox}>
                    <h2>Resumen:</h2>
                    <InfoPoint 
                        title={"Fecha:"}
                        value={date}
                        />

                    <InfoPoint 
                        title={"Proyecto:"}
                        value={transaction.project_name}
                        link={projectURL}
                        />

                    <InfoPoint 
                        title={"Cliente:"}
                        value={transaction.contact_name}
                        link={contactUrl}
                        />

                    <InfoPoint 
                        title={"Saldo inicial:"}
                        value={"$"+props.transaction.amount.toFixed(2)}
                        />

                    <InfoPoint 
                        title={"Saldo restante:"}
                        value={"$"+props.transaction.balance.toFixed(2)}
                        />
                </div>
                {buttons}
            </div>
        )
    }
}

export default transactionInfo