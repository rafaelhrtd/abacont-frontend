import React, { Component } from 'react';
import Login from './Login/Login'
import LoggedIn from './LoggedIn/LoggedIn'
import NewAccount from './NewAccount/NewAccount'
import AuthContext from '../../context/auth-context';
import Button from '../../UI/Buttons/Button/Button';
import Aux from '../../hoc/Aux/Aux'

class UserInfo extends Component {
    state = {
        new_account: false,
        edit_account: false
    }
    
    static contextType = AuthContext;

    newAccountHandler = () => {
        this.setState((prevState) => {
            return ({new_account: !prevState.new_account});
        })
    }

    editAccountHandler = () => {
        this.setState((prevState) => {
            return ({edit_account: !prevState.editAccountHandler});
        })
    }
    backHandler = () => {
        this.setState((prevState) => {
            return ({edit_account: false, new_account: false});
        })
    }
    
    render() {
        const loggedIn = this.context.authenticated
        let content = null;
        if (!this.state.new_account && !this.state.edit_account) {
            content = loggedIn ? (
                    <LoggedIn editAccountHandler={this.editAccountHandler}/>
                ) : (
                    <Login new_account={this.newAccountHandler} />)
        } else {
            content = 
                    <NewAccount 
                        new_account={this.newAccountHandler}
                        edit={this.state.edit_account}
                        backHandler={this.backHandler} />
        }
        return (
            <Aux>
                {content}
            </Aux>
        )
    }
}

export default UserInfo