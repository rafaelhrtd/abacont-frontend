import React, { Component } from 'react'
import AuthContext from '../../context/auth-context'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import RightDrawer from '../../components/Navigation/RightDrawer/RightDrawer'
import { Route, BrowserRouter, Redirect } from 'react-router-dom'
import App from '../../App'
import Axios from 'axios'
import MainContainer from './MainContainer/MainContainer'
import urlContext from '../../context/url-context'
import LeftDrawer from '../../components/Navigation/LeftDrawer/LeftDrawer'
class Layout extends Component {

    state = {
        initiateRightDrawer: (localStorage.getItem('jwtToken') === null &&
                                sessionStorage.getItem('jwtToken') === null),
        showRightDrawer: false,
        authenticated: !(localStorage.getItem('jwtToken') === null &&
                        sessionStorage.getItem('jwtToken') === null),
        user: (localStorage.getItem('user') !== null ?
                JSON.parse(localStorage.getItem('user')) : JSON.parse(sessionStorage.getItem('user'))),
        companies: (localStorage.getItem('companies') !== null ?
                JSON.parse(localStorage.getItem('user')) : JSON.parse(sessionStorage.getItem('companies'))),
        company: (localStorage.getItem('company') !== null ?
                JSON.parse(localStorage.getItem('user')) : JSON.parse(sessionStorage.getItem('company'))),
        showLeftDrawer: false,
        redirect: null
    }
    
    loginHandler = (response, remember_me = false) => {
        if (remember_me) {
            localStorage.setItem('jwtToken', response.headers.authorization)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            localStorage.setItem('companies', JSON.stringify(response.data.companies))
            localStorage.setItem('company', JSON.stringify(response.data.company))
        } else {
            sessionStorage.setItem('jwtToken', response.headers.authorization)
            sessionStorage.setItem('user', JSON.stringify(response.data.user))
            sessionStorage.setItem('companies', JSON.stringify(response.data.companies))
            sessionStorage.setItem('company', JSON.stringify(response.data.company))
        }
        this.setState({
            authenticated: true,
            user: response.data.user,
            companies: response.data.companies,
            company: response.data.company
        })
    }
    logoutHandler = () => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('company');
        sessionStorage.removeItem('companies');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        localStorage.removeItem('company');
        localStorage.removeItem('companies');
        this.setState({authenticated: false, user: null});
    }
    rightDrawerHandler = () => {
        this.setState((prevState) => {
            return {showRightDrawer: !prevState.showRightDrawer}
        })
    }
    leftDrawerHandler = () => {
        console.log("fuck")
        this.setState((prevState) => {
            return {showLeftDrawer: !prevState.showLeftDrawer}
        })
    }
    backDropHandler = () => {
        this.setState({showRightDrawer: false,
            initiateRightDrawer: false,
            showLeftDrawer: false})
    }
    render (){
        Axios.interceptors.response.use(
            response => response,
            error => {
                const {status} = error.response;
                if (status === 401){
                    console.log("KLOL")
                    this.logoutHandler();
                    this.setState({redirect: "/"})
                } else if (status === 403) {
                    // put what to do here
                    // should show a warning
                    this.setState({redirect: "/transacciones/"})
                    
                }
                return Promise.reject(error);
            }

        )

        if (this.state.redirect != null){
            console.log("woohoo")
            window.location.href = this.state.redirect
        }
        
        return (
            <urlContext.Provider value={{url: process.env.REACT_APP_API_ADDRESS}}>
                <AuthContext.Provider value={{
                    authenticated: this.state.authenticated,
                    user: this.state.user,
                    company: this.state.company,
                    login: this.loginHandler,
                    logout: this.logoutHandler}}>
                    <BrowserRouter>
                        <LeftDrawer 
                            backDropHandler={this.backDropHandler}
                            open={this.state.showLeftDrawer} />
                        <RightDrawer
                            open={this.state.showRightDrawer}
                            closed={this.rightDrawerHandler}
                            init={this.state.initiateRightDrawer}
                            backDropHandler={this.backDropHandler} />
                        <Toolbar
                            rightDrawer={this.rightDrawerHandler}
                            leftDrawer={this.leftDrawerHandler} />
                            <MainContainer>                        
                                <App />
                            </MainContainer>
                    </BrowserRouter>
                </AuthContext.Provider>
            </urlContext.Provider>

        )
    }
}

export default Layout