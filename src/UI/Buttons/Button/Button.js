import React from 'react';
import classes from "./Button.css"
const button = (props) => (
    <button 
        type={props.type === undefined? "button" : props.type}
        onClick={props.onClick}
        className={classes[props.className]}>
        {props.children}
    </button>
);

export default button