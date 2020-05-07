import React from 'react';
import FormHolder from '../../../../helpers/FormHolder';
import classes from './NewProject.css'
import NewContact from '../../Contacts/NewContact/NewContact'
import Form from '../../../Form/Form'
import { Redirect, withRouter } from 'react-router-dom'

class NewProject extends FormHolder {
    state = {
        form_data: {},
        errors: {},
        old_data: {},
        project: {}
    }


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


    successResponse = (data, url = null) => {
        let passed_state = this.state.passed_state
        console.log(data)
        if (passed_state !== undefined && passed_state.redirect_path !== undefined) {
            this.setState({redirect: passed_state.redirect_path})
        } else {
            console.log(process.env.REACT_APP_API_ADDRESS)
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
        let inputs = {
            name: {
                inputType: "text",
                name: "name",
                placeholder: "Nombre",
                blank: false
            },
            description: {
                inputType: "textarea",
                name: "description",
                placeholder: "Descripción"
            },
            value: {
                inputType: "text",
                name: "value",
                placeholder: "Valor total",
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
                placeholder: "Cliente",
                form_elements: NewContact.formElements("client"),
                input_suffix: "contact.",
                placeholder_suffix: "Nuevo cliente:",
                child: true
            },
            bill_number: {
                inputType: "text",
                name: "bill_number",
                placeholder: "Número de factura"
            }
        }
        return inputs
    }

    render(){
        let title = "Proyecto"
        const form_elements = NewProject.formElements()        
        
        // update search values
        if (this.state.project !== null) {
            let project = this.state.project
            form_elements.contact_id["id"] = project.contact_id
            form_elements.contact_id["givenName"] =  project.contact_name
        }

        const saveTitle = "Crear proyecto"
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