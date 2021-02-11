import React from 'react';
import FormHolder from '../../../../helpers/FormHolder';
import classes from './NewProject.css'
import NewContact from '../../Contacts/NewContact/NewContact'
import Form from '../../../Form/Form'
import AuthContext from '../../../../context/auth-context'
import { Redirect, withRouter } from 'react-router-dom'
import LocalizedStrings from 'react-localization';

class NewProject extends FormHolder {
    state = {
        form_data: {
            "project.name" : ""
        },
        errors: {},
        old_data: {},
        project: {}
    }

    static contextType = AuthContext;
    
    createProjectHandler = (event, edit = false) => {
        event.preventDefault()
        let data = this.setUpData(this.state.form_data)
        let url = process.env.REACT_APP_API_ADDRESS + "projects"
        url += edit === true ? "/" + this.props.project.id : ""
        this.submitHandler(event, 
                            url, 
                            data, 
                            this.successResponse, 
                            this.errorResponse, 
                            null,
                            edit)
    }

    hiddenDataHandler = (input) => {
        this.setState({[input.name]: input.value})
    }
    
    errorResponse = (errors) => {
        this.setState({errors: errors})
    }


    successResponse = (data, url = null) => {
        if (this.state.old_data === {}){
            this.context.setAlerts([
                {title: "Cambios guardados",
                 classes: ["success"],
                 message: null}
            ])
        } else {
            this.context.setAlerts([
                {
                    title: "Proyecto creado",
                    classes: ["success"],
                    message: null
                }
            ])
        }
        let passed_state = this.state.passed_state
        if (passed_state !== undefined && passed_state.redirect_path !== undefined) {
            this.setState({redirect: passed_state.redirect_path})
        } else {
            const redirectUrl = url !== null ? url : "/proyectos/" + data.project.id
            this.setState({redirect: redirectUrl})
        }
    }

    componentDidMount(){
        if (this.props.project !== undefined){
            this.setState({project: this.props.project})
            this.getPreviousValues(this.props.project, "project.");
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
            JSON.stringify(this.state) !== JSON.stringify(nextState)            
        )
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.project.id === {}){
            this.setState({project: this.props.project})
            this.getPreviousValues(this.props.project, "project.");
        }
    }

    static formElements = (suffix = null) => {
        let strings = new LocalizedStrings({
            en:{
                name: "Name",
                description: "Description",
                value: "Total value",
                client: "Client",
                newClient: "New client:",
                billNumber: "Bill number",
                title: "Project"
            },
            es: {
                name: "Nombre",
                description: "Descripción",
                value: "Valor total",
                client: "Cliente",
                newClient: "Nuevo cliente:",
                billNumber: "Número de factura",
                title: "Proyecto"
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
        let inputs = {
            name: {
                inputType: "text",
                name: "name",
                placeholder: strings.name,
                blank: false
            },
            description: {
                inputType: "textarea",
                name: "description",
                placeholder: strings.description
            },
            value: {
                inputType: "text",
                name: "value",
                placeholder: strings.value,
                blank: false
            },
            contact_id: {
                kind: "contact",
                name: "contact_id",
                suffix: "contact.",
                data: {
                    category: "client"
                },
                clicked_add: this.clickedAddHandler,
                url: 'contacts',
                search: true,
                placeholder: strings.client,
                form_elements: NewContact.formElements("client"),
                input_suffix: "contact.",
                placeholder_suffix: strings.newClient,
                child: true
            },
            bill_number: {
                inputType: "text",
                name: "bill_number",
                placeholder: strings.billNumber
            }
        }
        return inputs
    }

    render(){
        let strings = new LocalizedStrings({
            en:{
                title: "Project",
                createProject: "Create project"
            },
            es: {
                title: "Proyecto",
                createProject: "Crear proyecto"
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
        let title = strings.title
        const form_elements = NewProject.formElements()        
        
        // update search values
        if (this.state.project !== null) {
            let project = this.state.project
            form_elements.contact_id["id"] = project.contact_id
            form_elements.contact_id["givenName"] =  project.contact_name
        }

        const saveTitle = strings.createProject
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return(
            <div className={classes.NewTransaction}>
                <div className={classes.FormDiv}>
                    <h1>{title}</h1>
                    <Form
                        changed={this.changeHandler}
                        submit={this.createProjectHandler}
                        inputs={form_elements}
                        errors={this.state.errors}
                        suffix={"project."} 
                        removeChild={this.removeChildId}
                        clicked={this.clickedAddHandler}
                        submitText={saveTitle}
                        previousValues={this.state.form_data}
                        existingValues={this.state.old_data}
                        edit={this.props.project !== {} && 
                              this.props.project !== undefined}
                        old_data={this.state.old_data} />
                </div>
            </div>
        )
    }
}
export default withRouter(NewProject)