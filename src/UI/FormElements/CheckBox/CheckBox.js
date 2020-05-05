import React from 'react';
import classes from './CheckBox.css'
const checkBox = (props) => (
    <div className={props.givenClass}>
        <label className={classes.Checkbox}>{props.text}
            <input type="checkbox" />
            <span className={classes.Checkmark} onClick={props.clicked} name={props.name}></span>
        </label>
    </div>
);

export default checkBox