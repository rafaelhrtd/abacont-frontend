import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems'
import SessionItems from './SessionItems/SessionItems'
import { Menu } from 'react-feather';
const toolbar = (props) => {
    
    return (
        <header className={classes.Toolbar}>
            <div className={classes.Menu} onClick={props.leftDrawer}>
                <Menu />
            </div>
            <div className={classes.NavigationItems}>
                <NavigationItems />
            </div>
            <SessionItems
                clicked={props.rightDrawer} />
        </header>
    )
}

export default toolbar