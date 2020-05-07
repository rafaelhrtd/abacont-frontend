import React from 'react';
import classes from './Project.css';
import Getter from '../../../../helpers/Getter'
import { Route, withRouter, Switch, Link } from 'react-router-dom';
import TransactionBox from '../../../TransactionBox/TransactionBox';
import Button from '../../../../UI/Buttons/Button/Button';
import NewProject from '../NewProject/NewProject'

class Project extends Getter {
    state = {
        project: {},
        transactions: {},
        summary: {}
    }

    errorHandler = (errors) => {
        console.log(errors);
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
        this.getServerInfo(this.getUrl(), this.getData(), this.errorHandler, this.successHandler)
    }
    componentDidUpdate = () => {
        this.getServerInfo(this.getUrl(), this.getData(), this.errorHandler, this.successHandler)
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
                            redirect_path: redirect_path
                        }} />
                )
            })
        ) : null

        // set up the summary table
        
        let projectInfo = null
        projectInfo = summary.revenues !== undefined ? (
            <div className={classes.ProjectInfo}>
                <h2>Resumen</h2>
                {/* client info */}
                {project.client_id !== null ? (
                        <div className={classes.infoItem}>
                            <div>Cliente:</div>
                            <Link to={"/clientes/" + project.client_id}>
                                <div>{project.contact_name}</div>
                            </Link>
                        </div>
                ) : null}
                {project.description !== null ? (
                    <div className={classes.infoItem}>
                        <div>Descripción:</div>
                        <div>{project.description}</div>
                    </div>
                ) : null}

                <div className={classes.infoItem}>
                    <div>Valor nominal:</div>
                    <div>${project.value.toFixed(2)}</div>
                </div>
                {project.bill_number !== null ? (
                    <div className={classes.infoItem}>
                        <div>Factura:</div>
                        <div>{project.bill_number}</div>
                    </div>
                ) : null}

                <div className={classes.buttons}>
                    <Link to={{
                        pathname: editURL,
                        state: {project: project}
                    }}>
                        <Button className="warning">
                            Editar
                        </Button>
                    </Link>
                    <Button className="danger">
                        Eliminar
                    </Button>
                </div>
            </div>
        ) : null
        
        let projectPayments = null
        projectPayments = summary.revenues !== undefined ? (
            <div className={classes.ProjectInfo}>
                <h2>Estado</h2>
                <h3>Ingresos</h3>
                <div className={classes.infoItem}>
                    <div>Total facturado:</div>
                    <div>${summary.revenues.billed.toFixed(2)}</div>
                </div>
                <div className={classes.infoItem}>
                    <div>Ingresos:</div>
                    <div>${summary.revenues.received.toFixed(2)}</div>
                </div>
                <h3>Egresos</h3>
                <div className={classes.infoItem}>
                    <div>Total facturado:</div>
                    <div>${summary.expenses.billed.toFixed(2)}</div>
                </div>
                <div className={classes.infoItem}>
                    <div>Egresos:</div>
                    <div>${summary.expenses.paid.toFixed(2)}</div>
                </div>
                <h3>Totales:</h3>
                <div className={classes.infoItem}>
                    <div>Utilidad bruta esperada:</div>
                    <div>${(summary.revenues.billed - summary.expenses.billed).toFixed(2)}</div>
                </div>
                <div className={classes.infoItem}>
                    <div>Utilidad bruta actual:</div>
                    <div>${(summary.revenues.received - summary.expenses.paid).toFixed(2)}</div>
                </div>
            </div>
        ) : null

        return (
            <Switch>
                <Route path={this.props.match.url + "/"} exact render={() => (
                    <div className={classes.Project}>
                        <h1>{title}</h1>
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
