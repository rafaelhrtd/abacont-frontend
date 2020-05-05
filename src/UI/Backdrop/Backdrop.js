import React from 'react';
import classes from './Backdrop.css'

const backdrop = (props) => {
    let attachedClasses = []
    if (props.show) {
        attachedClasses = [classes.Backdrop, classes.Open]
    } else if (props.init) {
        attachedClasses = [classes.Backdrop, classes.Initiate]
    }

    return (
        (props.show || props.init) ? (<div className={attachedClasses.join(" ")} onClick={props.clicked}>
                      </div>) : null
    )
}

export default backdrop