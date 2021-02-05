import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Aux from '../../../hoc/Aux/Aux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faFileExcel, faUsers, faMoneyBill, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import classes from './Home.css'

class Home extends Component {
    render(){
        return (
            <Aux>
                <div className={classes.Container}>
                    <div className={classes.introduction}>
                        <h4>Abacont</h4>
                        <h1>Lo esencial para seguir el estado financiero de tu negocio.</h1>                    
                    </div>
                    <div className={[classes.banner, classes.hasIcon].join(" ")}>
                        <div className={[classes.content, classes.hasIcon].join(" ")}>
                            <FontAwesomeIcon icon={faCalculator} />
                            <div className={classes.hasText}>
                                <h2>Tus finanzas, sin complicaciones.</h2>
                                <h4>Nuestra prioridad es la claridad. Por eso, hemos simplificado el seguimiento de finanzas para pequeñas empresas.</h4>
                            </div>
                        </div>
                    </div>
                    <div class={classes.cardHolder}>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faMoneyBill} />
                                <h2>Tus finanzas</h2>
                                <h4>Crea ingresos, egresos y cuentas por cobrar / pagar.</h4>
                            </div>
                        </div>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faUsers} />
                                <h2>Tu equipo</h2>
                                <h4>Tus empleados pueden ayudar a recolectar datos, dependiendo de los permisos que les des.</h4>
                            </div>
                        </div>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faMoneyCheck} />
                                <h2>Contactos</h2>
                                <h4>Mantente al corriente de tus clientes y proveedores, incluyendo pagos y deudas.</h4>
                            </div>
                        </div>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faFileExcel} />
                                <h2>Reportes</h2>
                                <h4>Genera reportes mensuales y anuales. Compatible con Excel.</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        )
    }
}

export default withRouter(Home)