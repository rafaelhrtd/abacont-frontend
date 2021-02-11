import React, { useContext } from 'react';
import classes from "./LoggedIn.css";
import AuthContext from '../../../context/auth-context';
import Button from '../../../UI/Buttons/Button/Button';
import RightItems from '../../Navigation/RightDrawer/RightItems/RightItems';
import HR from '../../../UI/HR/HR';
import LocalizedStrings from 'react-localization';

const LoggedIn = (props) => {

    let strings = new LocalizedStrings({
      en:{
        logOut: "Log out",
        companies: "Companies",
        settings: "Settings"
      },
      es: {
        logOut: "Cerrar sesión",
        companies: "Compañías",
        settings: "Configuración"
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
    const logout = useContext(AuthContext).logout;
    const context = useContext(AuthContext);
    return (
        <div className={classes.LoggedIn}>
            <h2>{context.user.first_name}</h2>
            <h3>{context.company.name}</h3>
            <HR />
            <RightItems editAccountHandler={props.editAccountHandler} strings={strings} />
            <Button 
                className="danger"
                onClick={logout}>{strings.logOut}</Button>
        </div>
    )
}

export default LoggedIn
