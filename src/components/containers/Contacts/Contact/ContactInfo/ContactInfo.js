import React, { useContext } from 'react';
import classes from './ContactInfo.css'
import InfoPoint from '../../../../InfoPoint/InfoPoint'
import Aux from '../../../../../hoc/Aux/Aux'
import { Link } from 'react-router-dom'
import Button from '../../../../../UI/Buttons/Button/Button'
import DeleteButton from '../../../../../UI/Buttons/DeleteButton/DeleteButton'
import AuthContext from '../../../../../context/auth-context';
import LocalizedStrings from 'react-localization';

const contactInfo = (props) => {
    let strings = new LocalizedStrings({
        en:{
            summary: "Summary",
            name: "Name:",
            email: "Email:",
            phone: "Phone:",
            balance: "Balance:",
            edit: "Edit"
        },
        es: {
            summary: "Resumen",
            name: "Nombre:",
            email: "Email:",
            phone: "Teléfono:",
            balance: "Saldo:",
            edit: "Editar"
        }
       });
    let language = navigator.language;
    if (localStorage.getItem('language') !== null){
        language = localStorage.getItem('language');
    } else if (sessionStorage.getItem('language') !== null){
        language = sessionStorage.getItem('language');
    }
    const user = useContext(AuthContext).user
    if (props.contact === null) {
        return null
    } else {
        let editURL = props.contact.category === "client" ? (
            '/clientes/' + props.contact.id + "/editar"
        ) : ( '/proveedores/' + props.contact.id + "/editar")
        let redirectPath = props.contact.category === "client" ? (
            '/clientes/'
        ) : ( '/proveedores/')
        
        let buttons = user.can_edit ? (
            <div className={classes.buttons}>
                <Link to={{
                    pathname: editURL,
                    state: {contact: props.contact}
                }}>
                    <Button className="warning">
                        {strings.edit}
                    </Button>
                </Link>
                <DeleteButton 
                    object={{contact: props.contact}}
                    redirectPath={redirectPath} />
            </div>
        ) : null
        return(
            <Aux>
                <div className={classes.ContactInfo}>
                    <div className={classes.InfoBox}>
                        <h2>{strings.summary}</h2>
                        <InfoPoint 
                            title={strings.name}
                            value={props.contact.name}
                            />

                        <InfoPoint 
                            title={strings.email}
                            value={props.contact.email}
                            />

                        <InfoPoint 
                            title={strings.phone}
                            value={props.contact.phone}
                            />

                        <InfoPoint 
                            title={strings.balance}
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