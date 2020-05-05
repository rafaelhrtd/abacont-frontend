import React from 'react';
import classes from './InfoPoint.css'
import { Link } from 'react-router-dom'

const infoPoint = (props) => {
    if (props.value === null){
        return null
    } else {
        const valueDiv = props.link !== undefined ? (
            <Link to={props.link}>
                {props.value}
            </Link>
        ) : (
            <div className={classes.value}>
                {props.value}
            </div>
        )
        return(
            <div className={classes.infoPoint}>
                <div className={classes.title}>
                    {props.title}
                </div>
                {valueDiv}
            </div>
        )
    }
}

export default infoPoint