import React, { Component } from "react";
import classes from "./Employees.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Aux from '../../../../hoc/Aux/Aux';
import AuthContext from '../../../../context/auth-context';
import Modal from '../../../../UI/Modal/Modal';
import Permissions from '../Permissions/Permissions';
import Axios from 'axios';
import LocalizedStrings from 'react-localization';

class Employees extends Component {
    state  = {
        can_write: false,
        can_read: true,
        can_edit: false,
        can_invite: false,
        inviteDisabled: true,
        showModal: false,
        user_id: null,
        name: null,
        employee: {},
        name: null,
        errors: {}
    }

    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                changingPrivileges: "Changing privileges.",
                privilegesSaved: "Privileges saved.",
                eliminatingEmployeee: "Deleting employee",
                employeeEliminated: "Employee deleted.",
                name: "Name",
                editPrivileges: "Editing privileges for",
                saveChanges: "Save changes"

            },
            es: {
                changingPrivileges: "Cambiando permisos.",
                privilegesSaved: "Permisos guardados.",
                eliminatingEmployeee: "Eliminando empleado.",
                employeeEliminated: "Empleado eliminado.",
                name: "nombre",
                editPrivileges: "Editando permisos para",
                saveChanges: "Guardar cambios"
            }
           });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }

        language = language ? language : "en"
        strings.setLanguage(language)
        return strings 
    }

    showHandler = (employee = null) => {
        employee = employee === null ? this.state.employee : employee;
        let name = employee === null ? this.state.name : employee.first_name + " " + employee.last_name;
        let can_read = employee === null ? false : employee.can_read
        let can_write = employee === null ? false : employee.can_write
        let can_edit = employee === null ? false : employee.can_edit
        let can_invite = employee === null ? false : employee.can_invite
        this.setState(prevState => {
            return {
            showModal: !prevState.showModal,
            employee: employee,
            name: name,
            can_read: can_read,
            can_write: can_write,
            can_edit: can_edit,
            can_invite: can_invite}
        })
    }

    static contextType = AuthContext;

    commErrorHandler = (response) => {
    }

    successHandler = (data, message) => {
        this.props.refresh();
        this.context.toggleLoader(this.strings().changingPrivileges);
        this.showHandler()
        this.context.setAlerts([
            {title: message,
             classes: ["success"],
             message: null}
        ])
    }

    errorHandler = (data) => {
        this.setState({errors: data.errors})
        this.context.toggleLoader(this.strings().changingPrivileges);
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.context.toggleLoader(this.strings().changingPrivileges);
        const data = {
            company_tagging: {
                user_id: this.state.employee.id,
                can_read: this.state.can_read,
                can_write: this.state.can_write,
                can_edit: this.state.can_edit,
                can_invite: this.state.can_invite,
                company_id: this.state.employee.company_id
            }
        }
        const url = process.env.REACT_APP_API_ADDRESS + "update-permissions";
        Axios.patch(url, {...data})
            .then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        this.successHandler(response.data, this.strings().privilegesSaved)
                    } else {
                        this.errorHandler(response.data)
                    }
                }
            }, error => {
                this.commErrorHandler(error.response)
            })
    }

    deleteHandler = (user_id) => {
        this.context.toggleLoader(this.strings().eliminatingEmployeee);
        const data = {
            company_tagging: {
                user_id: user_id,
                company_id: this.context.company.id
            }
        }
        const url = process.env.REACT_APP_API_ADDRESS + "delete-employee";
        Axios.post(url, {...data})
            .then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        this.successHandler(response.data, this.strings().employeeEliminated)
                    } else {
                        this.errorHandler(response.data)
                    }
                }
            }, error => {
                this.commErrorHandler(error.response)
            })
    }


    changeHandler = (event, object = null) => {
        if (object === null) {
            this.setState({ 
                [event.target.name]: event.target.value
            })
        } else {
            this.setState({
                [object.name] : object.value
            })
        }
    }

    componentDidUpdate = () => {
        // disable invite if !can_edit and !can_write
        if ((this.state.can_edit === false || this.state.can_write === false) && this.state.inviteDisabled === false){
            this.setState({
                inviteDisabled: true,
                can_invite: false})
        } else if (this.state.can_edit === true && this.state.can_write === true && this.state.inviteDisabled === true) {
            this.setState({
                inviteDisabled: false,
            })
        }
    }

    render(){
        if (this.props.employees.length > 0){
            return(
                <Aux>
                    <table className={classes.employeeTable}>
                        <thead className="bg-primary">
                            <tr>
                                <th colSpan="2">
                                    {this.strings().name}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.employees.map(employee => {
                                return (
                                <tr key={employee.id}>
                                    <td>{employee.first_name + " " + employee.last_name}</td>
                                    <td>
                                        { this.props.isAdmin ? 
                                        (<Aux>
                                            <FontAwesomeIcon icon={faEdit} className="text-warning" onClick={() => this.showHandler(employee)} />
                                            <FontAwesomeIcon icon={faTrash}  className="text-danger" onClick={() => this.deleteHandler(employee.id)}/>
                                        </Aux>) : null }
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                    <Modal
                        show={this.state.showModal}
                        showHandler={this.showHandler}
                        className={classes.Modal}>
                        <h2>{this.strings().editPrivileges} {this.state.name}</h2>
                        <form onSubmit={event => {this.submitHandler(event)}}>
                            <input type="hidden" value={this.state.employee.id} name="employee_id" />
                            <input type="hidden" value={this.context.company.id} name="company_id" />
                            <Permissions
                                changeHandler = {this.changeHandler}
                                can_read = {this.state.can_read}
                                can_write = {this.state.can_write}
                                can_edit = {this.state.can_edit}
                                can_invite = {this.state.can_invite}
                                inviteDisabled={this.state.inviteDisabled}
                            />
    
                            <input type="submit" value={this.strings().saveChanges} className="btn-success" />
                        </form>
                    </Modal>
                </Aux>
    
    
                
            )
        } else {
            return null;
        }

    }
}

export default Employees
