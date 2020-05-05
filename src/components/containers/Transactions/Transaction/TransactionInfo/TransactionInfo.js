import React from 'react';
import classes from './TransactionInfo.css'
import { Link } from 'react-router-dom'
import Button from '../../../../../UI/Buttons/Button/Button'
import InfoPoint from '../../../../InfoPoint/InfoPoint'

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
                <Button className="danger">
                    Eliminar
                </Button>
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