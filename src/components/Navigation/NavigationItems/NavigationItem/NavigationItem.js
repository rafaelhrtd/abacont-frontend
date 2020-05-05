import React from 'react';
import classes from './NavigationItem.css'
import { Link } from 'react-router-dom';
const NavigationItem = (props) => (
    <Link to={props.link} className={classes.Link}>
        <span>{props.text}</span>
        <span className={classes.slider}></span>
    </Link>
)

export default NavigationItem