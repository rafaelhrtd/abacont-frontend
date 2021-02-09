import React from 'react';
import classes from './RightItems.css'
import RightItem from './RightItem/RightItem'

const RightItems = (props) => (
    <div className={classes.RightItems}>
        <ul>
        <RightItem
            link="/compañía">
            {props.strings.companies}
        </RightItem>
        <RightItem
            onClick={props.editAccountHandler}
            link="#">
            {props.strings.settings}
        </RightItem>

        </ul>
    </div>    
)

export default RightItems