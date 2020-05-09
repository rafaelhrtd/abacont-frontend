import React from 'react';
import classes from './CheckBox.css'
const checkBox = (props) => (
    <div className={props.givenClass}>
        <div>
            <label className={classes.Checkbox} onClick={props.clicked} onClick={props.clicked} >
                <div >
                  {props.text}
                </div>
                <input type="checkbox" onClick={props.clicked} />
                <span pointerEvents='none' className={classes.Checkmark} name={props.name}></span>
            </label>
        </div>
    </div>
);

export default checkBox