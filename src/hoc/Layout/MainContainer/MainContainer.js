import React from 'react';
import classes from './MainContainer.css'

const mainContainer = (props) => {
    let containerClasses = [classes.MainContainer]
    if (props.user === null){
        containerClasses = [...containerClasses, classes.loggedOut]
    }
    return (
    <div className={containerClasses.join(" ")}>
        {props.children}
    </div>
    )
}

export default mainContainer;