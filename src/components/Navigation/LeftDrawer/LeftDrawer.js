import React from 'react';
import classes from './LeftDrawer.css'
import Backdrop from '../../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/Aux/Aux'
import { NavLink } from 'react-router-dom'
import HR from '../../../UI/HR/HR';
import Logo from '../../../assets/images/logo-big.svg';

const leftDrawer = (props) => {
    let attachedClasses = [classes.LeftDrawer, classes.Closed]
    if (props.open) {
        attachedClasses = [classes.LeftDrawer, classes.Open]
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.backDropHandler} />
            <div className={attachedClasses.join(" ")}>
                <div className={classes.Logo}>
                    <img src={Logo} alt="React Logo" /> 
                </div>
                <h2>Finanzas</h2>
                <HR />
                <ul>
                    <li>
                        <NavLink to="/transacciones" onClick={props.backDropHandler}>
                            Resumen
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/ingresos" onClick={props.backDropHandler}>
                            Ingresos
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/cuentas-por-pagar" onClick={props.backDropHandler}>
                            Cuentas por pagar
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/egresos" onClick={props.backDropHandler}>
                            Egresos
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/cuentas-por-cobrar" onClick={props.backDropHandler}>
                            Cuentas por cobrar
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/proyectos" onClick={props.backDropHandler}>
                            Proyectos
                        </NavLink> 
                    </li>
                </ul>
                <h2>Contactos</h2>
                <HR />
                <ul>
                <li>
                        <NavLink to="/clientes" onClick={props.backDropHandler}>
                            Clientes
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to="/proveedores" onClick={props.backDropHandler}>
                            Proveedores
                        </NavLink> 
                    </li>
                </ul>
            </div>
        </Aux>
    )
}

export default leftDrawer