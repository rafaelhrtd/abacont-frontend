import React from 'react';
import classes from './Alert.css';
import shortid from "shortid";


const Alert = (props) => {
    const innerClasses = props.classes.map(currentClass => (
        classes[currentClass]
    ))

    let key = shortid.generate();

    return(
        <div key={key} className={[classes.Alert, classes.slideIn].join(" ")}>
            <div className={[classes.innerAlert, ...innerClasses].join(" ")}>
                <h3>{props.title}</h3>
                {props.message !== null ? (
                    <p>{props.message}</p>
                ) : null}
            </div>
        </div>
    )
}

export default Alert;