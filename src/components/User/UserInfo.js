import React, { Component } from 'react';
import Login from './Login/Login'
import LoggedIn from './LoggedIn/LoggedIn'
import NewAccount from './NewAccount/NewAccount'
import AuthContext from '../../context/auth-context';

class UserInfo extends Component {
    state = {
        new_account: false
    }
    
    static contextType = AuthContext;

    newAccountHandler = () => {
        this.setState((prevState) => {
            return ({new_account: !prevState.new_account})
        })
    }
    render() {
        const loggedIn = this.context.authenticated
        let content = null;
        if (this.state.new_account === false) {
            content = loggedIn ? (<LoggedIn />) : (<Login new_account={this.newAccountHandler} />)
        } else {
            content = <NewAccount new_account={this.newAccountHandler} />
        }
        return (content)
    }
}

export default UserInfo