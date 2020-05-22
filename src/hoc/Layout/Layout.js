import React, { Component } from 'react'
import AuthContext from '../../context/auth-context'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import RightDrawer from '../../components/Navigation/RightDrawer/RightDrawer'
import { Route, BrowserRouter, Redirect } from 'react-router-dom'
import App from '../../App'
import Axios from 'axios'
import MainContainer from './MainContainer/MainContainer'
import urlContext from '../../context/url-context'
import LeftDrawer from '../../components/Navigation/LeftDrawer/LeftDrawer';
import Loader from '../../UI/Loader/Loader';
import Alert from '../../UI/Alert/Alert';

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
        redirect: null,
        showLoader: false,
        alerts: [],
        alert: null
    }

    changeCurrentCompany = (company) => {
        this.setState({company: company})
    }

    toggleLoader = (title) => {
        this.setState(prevState => {return {
            showLoader: !prevState.showLoader,
            loaderTitle: title}})
    }

    setAlerts = (alerts) => {
        console.log(alerts);
        this.setState({alerts: alerts});
    }

    componentDidUpdate = (prevState) => {
        if (JSON.stringify(this.state.alerts) !== JSON.stringify(prevState.alerts)){
            this.iterateThroughAlerts()
        }
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

    shouldComponentUpdate = (prevProps, prevState) => {
        return(
            JSON.stringify(prevState) !== JSON.stringify(this.state)
        )
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

    updateInfo = (data) => {
        this.setState({
            user: data.user,
            companies: data.companies,
            company: data.company
        })
        if (localStorage.getItem('jwtToken')){
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('companies', JSON.stringify(data.companies))
            localStorage.setItem('company', JSON.stringify(data.company))
        } else if (sessionStorage.getItem('jwtToken')){
            sessionStorage.setItem('user', JSON.stringify(data.user))
            sessionStorage.setItem('companies', JSON.stringify(data.companies))
            sessionStorage.setItem('company', JSON.stringify(data.company))
        }
    }

    errorHandler = (data) => {
        console.log(data)
    }

    iterateThroughAlerts = () => {
        let alerts = this.state.alerts
        console.log(alerts);
        alerts.push(null)
        let count = 0
        console.log(alerts);
        if (alerts[0] === null){
        } else {
            alerts.map(alert => {
                setTimeout(()=>{
                    if (alert !== null) {
                        console.log("alert:")
                        console.log(alert)
                        console.log(alert.classes)
                        alert.classes.push("slideIn")
                        this.setState({alert: alert})
                    } else {
                        this.setState({alerts: [], alert: null})
                    }
                }, 3000 * count);
                count++;
            })
        }
    }

    updateUserInfo = () => {
        const url = process.env.REACT_APP_API_ADDRESS + "/userinfo"
        Axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        this.updateInfo(response.data)
                    } else {
                        this.errorHandler(response.data)
                    }
                }
            }, error => {
                console.log(error)
                setTimeout(()=>{
                    window.location.href = "/"
                },0)
            })
    }
    rightDrawerHandler = () => {
        this.setState((prevState) => {
            return {showRightDrawer: !prevState.showRightDrawer}
        })
    }
    leftDrawerHandler = () => {
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
            window.location.href = this.state.redirect
        }
        
        return (
            <urlContext.Provider value={{url: process.env.REACT_APP_API_ADDRESS}}>
                <AuthContext.Provider value={{
                    authenticated: this.state.authenticated,
                    user: this.state.user,
                    company: this.state.company,
                    companies: this.state.companies,
                    toggleLoader: this.toggleLoader,
                    setAlerts: this.setAlerts,
                    login: this.loginHandler,
                    changeCurrentCompany: this.changeCurrentCompany,
                    currentCompany: this.state.company,
                    updateUserInfo: this.updateUserInfo,
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
                        {this.state.alert != null ? (
                            <Alert 
                                title={this.state.alert.title}
                                message={this.state.alert.message}
                                classes={this.state.alert.classes} />

                        ): null}
                        <Loader 
                            show={this.state.showLoader}
                            title={this.state.loaderTitle} />
                    </BrowserRouter>
                </AuthContext.Provider>
            </urlContext.Provider>

        )
    }
}

export default Layout