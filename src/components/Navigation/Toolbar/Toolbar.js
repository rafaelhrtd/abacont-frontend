import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems'
import SessionItems from './SessionItems/SessionItems'
import { Menu } from 'react-feather';
import LogoBig from '../../../assets/images/logo-big.svg'
import Logo from '../../../assets/images/logo.svg'
const toolbar = (props) => {
    
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
                    clicked={props.rightDrawer} />
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
                    clicked={props.rightDrawer} />
            </div>
        </header>
    )
}

export default toolbar