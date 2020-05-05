import React, { useContext } from 'react';
import classes from './SessionItems.css';
import AuthContext from '../../../../context/auth-context'
import Button from '../../../../UI/Buttons/Button/Button'

const sessionItems = (props) => {
    const loggedIn = useContext(AuthContext).authenticated
    const content = loggedIn ? (
        <Button className="primary" onClick={props.clicked}>
            Lol
        </Button>
    ) : (
        <Button className="primary" onClick={props.clicked}>
            Iniciar sesión
        </Button>
    );
    return (
        <div className={classes.SessionItems}>{content}</div>
    )
}

export default sessionItems