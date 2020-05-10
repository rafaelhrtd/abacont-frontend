import React, { useContext } from 'react';
import classes from "./LoggedIn.css";
import AuthContext from '../../../context/auth-context';
import Button from '../../../UI/Buttons/Button/Button'
import RightItems from '../../Navigation/RightDrawer/RightItems/RightItems'
import HR from '../../../UI/HR/HR'

const LoggedIn = () => {
    const logout = useContext(AuthContext).logout;
    const context = useContext(AuthContext);
    return (
        <div className={classes.LoggedIn}>
            <h2>{context.user.first_name}</h2>
            <h3>{context.company.name}</h3>
            <HR />
            <RightItems />
            <Button 
                className="danger"
                onClick={logout}>Cerrar sesión</Button>
        </div>
    )
}

export default LoggedIn
