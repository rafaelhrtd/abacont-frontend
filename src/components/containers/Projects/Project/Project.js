import React from 'react';
import classes from './Project.css';
import Getter from '../../../../helpers/Getter'
import { Route, withRouter, Switch, Link } from 'react-router-dom';
import TransactionBox from '../../../TransactionBox/TransactionBox';
import Button from '../../../../UI/Buttons/Button/Button';
import NewProject from '../NewProject/NewProject';
import DeleteButton from '../../../../UI/Buttons/DeleteButton/DeleteButton';
import ExcelButton from '../../../../UI/Buttons/ExcelButton/ExcelButton';
import AuthContext from '../../../../context/auth-context';
import LocalizedStrings from 'react-localization';

class Project extends Getter {
    state = {
        project: {},
        transactions: {},
        summary: {}
    }

    static contextType = AuthContext;

    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                summary: "Summary",
                client: "Client",
                expectedValue: "Expected value",
                billedTotal: "Billed total",
                billNumber: "Número de factura",
                edit: "Edit",
                delete: "Delete",
                expenses: "Expenses",
                revenues: "Revenues",
                state: "Current state",
                expectedProfit: "Expected profit",
                currentProfit: "Current profit",
                totals: "Totals"
            },
            es: {
                summary: "Resumen",
                client: "Cliente",
                expectedValue: "Valor nominal",
                billedTotal: "Total facturado",
                billNumber: "Número de factura",
                edit: "Editar",
                delete: "Eliminar",
                expenses: "Egresos",
                revenues: "Ingresos",
                state: "Estado actual",
                expectedProfit: "Utilidad bruta esperada",
                currentProfit: "Utilidad bruta actual",
                totals: "Totales"
            }
        });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        language = language ? language : "en"
        strings.setLanguage(language);
        return strings;        
    }


    errorHandler = () => {
        this.setState({commError: true});
    }

    successHandler = (data) => {
        this.setState({
            project: data.project,
            transactions: data.transactions,
            summary: data.summary
        }) //should also get transactions here once they are set up
    }

    getUrl = () => {
        const id = this.props.match.params.id
        const url = process.env.REACT_APP_API_ADDRESS + "projects/" + id
        return url
    }

    getData = () => {
        return null
    }
    
    shouldComponentUpdate = (nextProps, nextState) =>{
        return JSON.stringify(this.state) !== JSON.stringify(nextState) || 
            JSON.stringify(this.props) !== JSON.stringify(nextProps)
    }


    componentDidMount = () => {
        if (!this.state.commError){
            this.getServerInfo(this.getUrl(), this.getData(), this.errorHandler, this.successHandler)
        }
    }
    componentDidUpdate = () => {
        if (!this.state.commError){
            this.getServerInfo(this.getUrl(), this.getData(), this.errorHandler, this.successHandler)
        }
    }

    render(){
        const redirect_path = this.props.location.pathname
        const summary = this.state.summary
        const project = this.state.project
        const title = project !== {} ? project.name : null
        const editURL = project !== {} ? "/proyectos/" + project.id + "/editar" : null

        let tranBoxes = null

        tranBoxes = project !== {} ? (
            Object.keys(this.state.transactions).map(obKey => {
                let contact_id = null
                let contact_name = null
                if (["revenue", "receivable"].includes(obKey)){
                    contact_id = project.contact_id,
                    contact_name = project.contact_name
                }
                return (
                    <TransactionBox
                        key={obKey}
                        transactions={this.state.transactions[obKey]}
                        category={obKey}
                        redirect_path={redirect_path}
                        stateToPass={{
                            contact_id: contact_id,
                            contact_name: contact_name,
                            project_id: project.id,
                            project_name: project.name,
                            path: redirect_path
                        }}
                        seeMoreState={{
                            project_id: this.state.project.id
                        }} />
                )
            })
        ) : null

        // set up the summary table
        
        let projectInfo = null
        projectInfo = summary.revenues !== undefined ? (
            <div className={classes.ProjectInfo}>
                <h2>{this.strings().summary}</h2>
                {/* client info */}
                {project.client_id !== null ? (
                        <div className={classes.infoItem}>
                            <div>{this.strings().client}:</div>
                            <Link to={"/clientes/" + project.client_id}>
                                <div>{project.contact_name}</div>
                            </Link>
                        </div>
                ) : null}
                {project.description !== null ? (
                    <div className={classes.infoItem}>
                        <div>{this.strings().description}:</div>
                        <div>{project.description}</div>
                    </div>
                ) : null}

                <div className={classes.infoItem}>
                    <div>{this.strings().expectedValue}:</div>
                    <div>${project.value.toFixed(2)}</div>
                </div>
                {project.bill_number !== null ? (
                    <div className={classes.infoItem}>
                        <div>{this.strings.billNumber}:</div>
                        <div>{project.bill_number}</div>
                    </div>
                ) : null}
                {
                    this.context.user.can_edit ? (
                        <div className={classes.buttons}>
                            <Link to={{
                                pathname: editURL,
                                state: {project: project}
                            }}>
                                <Button className="warning">
                                    {this.strings().edit}
                                </Button>
                            </Link>
                            <DeleteButton 
                                object={{project: project}}
                                redirectPath="/proyectos/" />
                        </div>
                    ) : null
                }
            </div>
        ) : null
        
        let projectPayments = null
        projectPayments = summary.revenues !== undefined ? (
            <div className={classes.ProjectInfo}>
                <h2>{this.strings().state}</h2>
                <h3>{this.strings().revenues}</h3>
                <div className={classes.infoItem}>
                    <div>{this.strings().billedTotal}:</div>
                    <div>${summary.revenues.billed.toFixed(2)}</div>
                </div>
                <div className={classes.infoItem}>
                    <div>{this.strings().revenues}:</div>
                    <div>${summary.revenues.received.toFixed(2)}</div>
                </div>
                <h3>{this.strings().expenses}</h3>
                <div className={classes.infoItem}>
                    <div>{this.strings().billedTotal}:</div>
                    <div>${summary.expenses.billed.toFixed(2)}</div>
                </div>
                <div className={classes.infoItem}>
                    <div>{this.strings().expenses}:</div>
                    <div>${summary.expenses.paid.toFixed(2)}</div>
                </div>
                <h3>{this.strings().totals}:</h3>
                <div className={classes.infoItem}>
                    <div>{this.strings().expectedProfit}:</div>
                    <div>${(summary.revenues.billed - summary.expenses.billed).toFixed(2)}</div>
                </div>
                <div className={classes.infoItem}>
                    <div>{this.strings().currentProfit}:</div>
                    <div>${(summary.revenues.received - summary.expenses.paid).toFixed(2)}</div>
                </div>
            </div>
        ) : null

        return (
            <Switch>
                <Route path={this.props.match.url + "/"} exact render={() => (
                    <div className={classes.Project}>
                        <h1>{title}</h1>
                        <ExcelButton   
                            month={this.state.month}
                            year={this.state.year}
                            yearly={this.state.yearly}
                            kind="transactions"
                            project_id={this.state.project.id} />
                        {projectInfo}
                        {projectPayments}
                        <div className={classes.Transactions}>
                            {tranBoxes}
                        </div>
                    </div>
                )} />
                <Route path={this.props.match.url + "/editar"} exact render={() => (
                        <NewProject 
                            project={this.state.project} />
                )} />
            </Switch>
        )

    }
}

export default withRouter(Project);
