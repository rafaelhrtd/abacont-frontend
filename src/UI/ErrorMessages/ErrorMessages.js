import React from 'react'
import classes from './ErrorMessages.css'

const ErrorMessages = (props) => {
    return (
        <div className={classes.Errors}>
            <ul>
                {
                    Object.keys(props.errors).map(errorKey => (
                        <li key={errorKey}>{props.errors[errorKey]}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ErrorMessages