import React, { useContext } from 'react';
import classes from './SessionItems.css';
import AuthContext from '../../../../context/auth-context'
import Button from '../../../../UI/Buttons/Button/Button'
import { User } from 'react-feather';

const sessionItems = (props) => {
    const loggedIn = useContext(AuthContext).authenticated
    const content = loggedIn ? (
        <div onClick={props.clicked} className={classes.Feather}>
            <User />
        </div>
    ) : (
        <Button className="primary" onClick={props.clicked}>
            {props.strings.login}
        </Button>
    );
    return (
        <div className={classes.SessionItems}>{content}</div>
    )
}

export default sessionItems