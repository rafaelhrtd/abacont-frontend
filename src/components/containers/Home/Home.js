import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Aux from '../../../hoc/Aux/Aux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faFileExcel, faUsers, faMoneyBill, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import classes from './Home.css';
import bannerImage from '../../../assets/images/homeBanner.jpg';
import LocalizedStrings from 'react-localization';

class Home extends Component {
    render(){
        let strings = new LocalizedStrings({
            en:{
                intro: "Essentials to stay up to date with your finances.",
                secondBannerTitle: "Your finances, made easy.",
                secondBannerText: "Clarity is our priority. We have simplified the tracking of small businesses' finances.",
                yourFinances: "Your Finances",
                yourFinancesText: "Log the money coming in and out of your business, as well as accounts payable and accounts receivable.",
                yourTeam: "Your Team",
                yourTeamText: "Your employees can help you collect data, according to the permissions you give them.",
                yourContacts: "Your Contacts",
                yourContactsText: "Keep up to date with your clients and providers, including any payments and debts.",
                yourReports: "Your Reports",
                yourReportsText: "Generate monthly and yearly reports. Compatible with Excel."
            },
            es: {
                intro: "Lo esencial para seguir el estado financiero de tu negocio.",
                secondBannerTitle: "Tus finanzas, sin complicaciones.",
                secondBannerText: "Nuestra prioridad es la claridad. Por eso, hemos simplificado el seguimiento de finanzas para pequeñas empresas.",
                yourFinances: "Tus finanzas",
                yourFinancesText: "Crea ingresos, egresos y cuentas por cobrar / pagar.",
                yourTeam: "Tu equipo",
                yourTeamText: "Tus empleados pueden ayudar a recolectar datos, dependiendo de los permisos que les otorgues.",
                yourContacts: "Tus contactos",
                yourContactsText: "Mantente al corriente de tus clientes y proveedores, incluyendo pagos y deudas.",
                yourReports: "Tus reportes",
                yourReportsText: "Genera reportes mensuales y anuales. Compatible con Excel."
            }
           });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        strings.setLanguage(language);
        return (
            <Aux>
                <div className={classes.Container}>
                    <div className={[classes.banner, classes.topBanner].join(" ")}>
                        <img src={bannerImage} />
                    </div>
                    <div className={classes.introduction}>
                        <h4>Abacont</h4>
                        <h1>{strings.intro}</h1>                    
                    </div>
                    <div className={[classes.banner, classes.hasIcon].join(" ")}>
                        <div className={[classes.content, classes.hasIcon].join(" ")}>
                            <FontAwesomeIcon icon={faCalculator} />
                            <div className={classes.hasText}>
                                <h2>{strings.secondBannerTitle}</h2>
                                <h4>{strings.secondBannerText}</h4>
                            </div>
                        </div>
                    </div>
                    <div class={classes.cardHolder}>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faMoneyBill} />
                                <h2>{strings.yourFinances}</h2>
                                <h4>{strings.yourFinancesText}</h4>
                            </div>
                        </div>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faUsers} />
                                <h2>{strings.yourTeam}</h2>
                                <h4>{strings.yourTeamText}</h4>
                            </div>
                        </div>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faMoneyCheck} />
                                <h2>{strings.yourContacts}</h2>
                                <h4>{strings.yourContactsText}</h4>
                            </div>
                        </div>
                        <div class={classes.outerCard}>
                            <div class={classes.card}>
                                <FontAwesomeIcon icon={faFileExcel} />
                                <h2>{strings.yourReports}</h2>
                                <h4>{strings.yourReportsText}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        )
    }
}

export default withRouter(Home)