import React from 'react';
import classes from './RightItem.css';
import { Link } from 'react-router-dom';

const RightItem = (props) => (
    <li className={classes.RightItem} onClick={props.onClick}>
        <Link to={props.link}>
            <p>{props.children}</p>
        </Link>
    </li>
)
export default RightItem;