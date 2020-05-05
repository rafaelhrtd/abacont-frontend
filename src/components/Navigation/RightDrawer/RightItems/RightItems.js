import React from 'react';
import classes from './RightItems.css'
import RightItem from './RightItem/RightItem'

const RightItems = (props) => (
    <div className={classes.RightItems}>
        <ul>
        <RightItem
            link="/">
            Compañías
        </RightItem>
        <RightItem
            link="/">
            Subscripciones
        </RightItem>
        <RightItem
            link="/">
            Configuración
        </RightItem>

        </ul>
    </div>    
)

export default RightItems