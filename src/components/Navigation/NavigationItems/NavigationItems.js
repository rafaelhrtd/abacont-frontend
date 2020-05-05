import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'
import classes from './NavigationItems.css'

const NavigationItems = (props) => {
    return (
        <div className={classes.NavigationItems}>
        <ul>
            <li>
                <NavigationItem link="/" text="Página Principal" /> 
            </li>
            <li>
                <NavigationItem link="/transacciones" text="Transacciones" />
            </li>
            <li>
                <NavigationItem link="/proyectos" text="Proyectos" />
            </li>
            <li>
                <NavigationItem link="/clientes" text="Clientes" />
            </li>
            <li>
                <NavigationItem link="/proveedores" text="Proveedores" />
            </li>
        </ul>
        </div>
    )
}

export default NavigationItems