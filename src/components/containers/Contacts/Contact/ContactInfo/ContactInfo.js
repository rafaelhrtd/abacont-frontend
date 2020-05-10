import React from 'react';
import classes from './ContactInfo.css'
import InfoPoint from '../../../../InfoPoint/InfoPoint'
import Aux from '../../../../../hoc/Aux/Aux'
import { Link } from 'react-router-dom'
import Button from '../../../../../UI/Buttons/Button/Button'
import DeleteButton from '../../../../../UI/Buttons/DeleteButton/DeleteButton'

const contactInfo = (props) => {
    if (props.contact === null) {
        return null
    } else {
        let editURL = props.contact.category === "client" ? (
            '/clientes/' + props.contact.id + "/editar"
        ) : ( '/proveedores/' + props.contact.id + "/editar")
        let redirectPath = props.contact.category === "client" ? (
            '/clientes/'
        ) : ( '/proveedores/')
        
        let buttons = (
            <div className={classes.buttons}>
                <Link to={{
                    pathname: editURL,
                    state: {contact: props.contact}
                }}>
                    <Button className="warning">
                        Editar
                    </Button>
                </Link>
                <DeleteButton 
                    object={{contact: props.contact}}
                    redirectPath={redirectPath} />
            </div>
        )
        return(
            <Aux>
                <div className={classes.ContactInfo}>
                    <div className={classes.InfoBox}>
                        <h2>Resumen:</h2>
                        <InfoPoint 
                            title={"Nombre:"}
                            value={props.contact.name}
                            />

                        <InfoPoint 
                            title={"Email:"}
                            value={props.contact.email}
                            />

                        <InfoPoint 
                            title={"Teléfono:"}
                            value={props.contact.phone}
                            />

                        <InfoPoint 
                            title={"Saldo:"}
                            value={"$"+props.contact.balance.toFixed(2)}
                            />
                    </div>
                    {buttons}

                </div>
            </Aux>
        )
    }
}

export default contactInfo