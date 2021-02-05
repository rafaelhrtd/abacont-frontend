import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'
import classes from './NavigationItems.css'

const NavigationItems = (props) => {
    const passedClass = props.className === undefined ? classes.NavigationItems : props.className
    return (
        <div className={passedClass}>
        <ul>
            <li>
                <NavigationItem link="/" text="Página Principal" /> 
            </li>
            <li>
                <NavigationItem link="/" text="Transacciones" />
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