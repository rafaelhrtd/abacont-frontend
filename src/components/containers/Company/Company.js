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

    componentDidUpdate = (prevProps, prevState) => {
        if (JSON.stringify(prevState.company) !== JSON.stringify(this.state.company)){
            this.getInvites();
        }
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
                    { this.context.user.role === 'owner' ? (
                        <NameChanger 
                            contextChange={this.getContext}
                            company={this.state.company} />
                    ) : null}
                </h1>
                
                <div className={classes.buttons}>
                    {changeCompany}
                </div>
                <h2>Miembros</h2>
                { this.context.user.can_invite ? (
                    <Aux>
                        <Inviter addInvite={this.getInvites}/>
                        { this.state.invites.length > 0 ? (
                            <Aux>
                                <h3>Invitaciones pendientes</h3>
                                <Invites 
                                    invites={this.state.invites}
                                    getInvites={this.getInvites} />
                            </Aux>

                        ) : null}
                    </Aux>
                ) : null}
                { this.context.user.role === "owner" ? (
                    <Aux>
                        <h2>Subscripción</h2>
                        <p>To do</p>
                    </Aux>
                ) : null}
                <Button className="success">Registrar nueva compañía</Button>
            </div>
        )
    }
}

export default Company