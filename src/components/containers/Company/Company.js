import React, { Component } from 'react';
import Aux from '../../../hoc/Aux/Aux';
import classes from './Company.css';
import Button from '../../../UI/Buttons/Button/Button';
import Switcher from './Switcher/Switcher';
import AuthContext from '../../../context/auth-context';
import NameChanger from './NameChanger/NameChanger';
import Inviter from './Inviter/Inviter';
import Axios from 'axios'
import Invites from './Invites/Invites';
import Employees from './Employees/Employees';
import LocalizedStrings from 'react-localization';

class Company extends Component {
    static contextType = AuthContext;

    state = {
        company: this.context.company,
        companies: this.context.companies,
        employees: [],
        invites: []
    }

    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                teamMembers: "Team Members",
                newCompany: "Register new company",
                pendingInvitations: "Pending invitations"
            },
            es: {
                teamMembers: "Miembros",
                newCompany: "Registrar nueva compañía",
                pendingInvitations: "Invitaciones pendientes"
            }
           });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        }
        return strings
    }

    componentDidMount = () => {
        console.log("fuck")
        console.log(this.context.company)
        this.getInvites();
        this.getEmployees();
    }

    commErrorHandler = (response) => {
        console.log(response)
    }

    getInvites = () => {
        const url = process.env.REACT_APP_API_ADDRESS + "/invites";
        Axios.get(url)
            .then(response => {
                this.setState({invites: response.data.invites})
            }, error => {
                this.commErrorHandler(error.response)
            })
    }

    getEmployees = () => {
        const url = process.env.REACT_APP_API_ADDRESS + "/employees";
        Axios.get(url)
            .then(response => {
                console.log(response)
                this.setState({employees: response.data.employees})
            }, error => {
                this.commErrorHandler(error.response)
            })
    }

    getContext = (company=null) => {
        if (company == null){
            this.setState({company: this.context.company})

        } else {
            this.setState({company: company})
        }
    }

    shouldComponentUpdate = (prevProps, prevState) => {
        return (prevState.company !== this.state.company ||
            JSON.stringify(prevState.companies) !== JSON.stringify(this.state.companies) ||
            JSON.stringify(prevState.invites) !== JSON.stringify(this.state.invites) ||
            JSON.stringify(prevState.employees) !== JSON.stringify(this.state.employees));
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (JSON.stringify(prevState.company) !== JSON.stringify(this.state.company)){
            this.getInvites();
            this.getEmployees();
        }
    }

    render(){
        const changeCompany = (this.state.companies.length > 1) ? (
            <Switcher clicked={this.getContext} />
        ) : null
        return (
            <div className={classes.Company}>
                <h1>
                    {this.state.company.name}
                    { this.context.user.role === 'owner' ? (
                        <NameChanger 
                            contextChange={this.getContext}
                            company={this.state.company} />
                    ) : null}
                </h1>
                
                <div className={classes.buttons}>
                    {changeCompany}
                </div>
                <h2>{this.strings().members}</h2>
                <Employees
                    employees={this.state.employees} 
                    isAdmin={this.context.isAdmin} 
                    refresh={this.getEmployees} />
                { this.context.user.can_invite ? (
                    <Aux>
                        <Inviter addInvite={this.getInvites}/>
                        { this.state.invites.length > 0 ? (
                            <Aux>
                                <h3>{this.strings().pendingInvitations}</h3>
                                <Invites 
                                    invites={this.state.invites}
                                    getInvites={this.getInvites} />
                            </Aux>

                        ) : null}
                    </Aux>
                ) : null}
                <Button className="success">{this.strings().newCompany}</Button>
            </div>
        )
    }
}

export default Company