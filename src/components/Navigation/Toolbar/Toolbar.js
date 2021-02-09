import React from 'react';
import classes from './Toolbar.css';
import SessionItems from './SessionItems/SessionItems';
import { Menu } from 'react-feather';
import LogoBig from '../../../assets/images/logo-big.svg';
import Logo from '../../../assets/images/logo.svg';
import LocalizedStrings from 'react-localization';
const toolbar = (props) => {

    let strings = new LocalizedStrings({
      en:{
        login: "Log in"
      },
      es: {
        login: "Iniciar sesión"
      }
     });
    let language = navigator.language;
    if (localStorage.getItem('language') !== null){
        language = localStorage.getItem('language');
    } else if (sessionStorage.getItem('language') !== null){
        language = sessionStorage.getItem('language');
    } 
    
    return props.loggedIn ? (
        <header className={classes.Toolbar}>
            <div className={classes.Menu} onClick={props.leftDrawer}>
                <Menu />
            </div>
            <div className={[classes.centerLogo, classes.Menu].join(" ")}>
                <img src={Logo} alt="React Logo" />
            </div>
            <div className={[classes.NavigationItems, classes.LogoBig].join(" ")}>
                <img src={LogoBig} alt="Abacont" />
            </div>
            <div className={classes.Session}>
                <SessionItems
                    clicked={props.rightDrawer}
                    strings={strings} />
            </div>
        </header>
    ) : (
        <header className={classes.Toolbar}>
            <div className={[classes.centerLogo, classes.Menu].join(" ")}>
                <img src={Logo} alt="React Logo" />
            </div>
            <div className={[classes.NavigationItems, classes.LogoBig].join(" ")}>
                <img src={LogoBig} alt="Abacont" />
            </div>
            <div className={classes.Session}>
                <SessionItems
                    clicked={props.rightDrawer}
                    strings={strings} />
            </div>
        </header>
    )
}

export default toolbar