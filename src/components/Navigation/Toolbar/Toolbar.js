import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems'
import SessionItems from './SessionItems/SessionItems'
const toolbar = (props) => {
    
    return (
        <header className={classes.Toolbar}>
            <NavigationItems />
            <SessionItems
                clicked={props.rightDrawer} />
        </header>
    )
}

export default toolbar