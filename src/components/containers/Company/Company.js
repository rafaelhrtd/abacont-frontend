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

class Company extends Component {
    state = {
        company: this.context.company,
        companies: this.context.companies,
        invites: []
    }

    componentDidMount = () => {
        this.getInvites();
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

    getContext = (company=null) => {
        if (company == null){
            this.setState({company: this.context.company})

        } else {
            this.setState({company: company})
        }
    }

    shouldComponentUpdate = (prevProps, prevState) => {
        return (prevState.company !== this.state.company ||
            JSON.stringify(prevState.invites) !== JSON.stringify(this.state.invites));
    }

    static contextType = AuthContext;
    render(){
        const changeCompany = (this.state.companies.length > 1) ? (
            <Switcher clicked={this.getContext} />
        ) : null
        return (
            <div className={classes.Company}>
                <h1>
                    {this.state.company.name}
                    <NameChanger 
                        contextChange={this.getContext}
                        company={this.state.company} />
                </h1>
                
                <div className={classes.buttons}>
                    {changeCompany}
                </div>
                <h2>Miembros</h2>
                <Inviter addInvite={this.getInvites}/>
                <h3>Invitaciones pendientes</h3>
                <Invites 
                    invites={this.state.invites}
                    getInvites={this.getInvites} />
                <h2>Subscripción</h2>
                <p>To do</p>
                <Button className="success">Registrar nueva compañía</Button>
            </div>
        )
    }
}

export default Company