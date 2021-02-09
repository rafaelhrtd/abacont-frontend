import React, { Component } from 'react'
import AuthContext from '../../context/auth-context'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import RightDrawer from '../../components/Navigation/RightDrawer/RightDrawer'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import App from '../../App'
import Axios from 'axios'
import MainContainer from './MainContainer/MainContainer'
import urlContext from '../../context/url-context'
import LeftDrawer from '../../components/Navigation/LeftDrawer/LeftDrawer';
import Loader from '../../UI/Loader/Loader';
import Alert from '../../UI/Alert/Alert';
import Aux from '../../hoc/Aux/Aux';
import Invite from '../../components/containers/Invite/Invite';
import LocalizedStrings from 'react-localization';
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
        this.setState({alerts: alerts});
    }

    componentDidUpdate = (prevState) => {
        if (JSON.stringify(this.state.alerts) !== JSON.stringify(prevState.alerts)){
            this.iterateThroughAlerts()
        }
    }

    componentDidMount = () => {
        if (this.state.authenticated){
            this.updateUserInfo();
        }
    }
    
    loginHandler = (response, remember_me = false) => {
        if (remember_me) {
            localStorage.setItem('jwtToken', response.headers.authorization)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            localStorage.setItem('companies', JSON.stringify(response.data.companies))
            localStorage.setItem('language', JSON.stringify(response.data.user.language))
            localStorage.setItem('company', JSON.stringify(response.data.company))
        } else {
            sessionStorage.setItem('jwtToken', response.headers.authorization)
            sessionStorage.setItem('user', JSON.stringify(response.data.user))
            sessionStorage.setItem('language', JSON.stringify(response.data.user.language))
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
            localStorage.setItem('language', JSON.stringify(data.user.language))
            localStorage.setItem('companies', JSON.stringify(data.companies))
            localStorage.setItem('company', JSON.stringify(data.company))
        } else if (sessionStorage.getItem('jwtToken')){
            sessionStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('language', JSON.stringify(data.user.language))
            sessionStorage.setItem('companies', JSON.stringify(data.companies))
            sessionStorage.setItem('company', JSON.stringify(data.company))
        }
    }

    errorHandler = (data) => {
        console.log(data)
    }

    iterateThroughAlerts = () => {
        let alerts = this.state.alerts
        alerts.push(null)
        let count = 0
        if (alerts[0] === null){
        } else {
            alerts.map(alert => {
                setTimeout(()=>{
                    if (alert !== null) {
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
    removeRedirect = () => {
        this.setState({redirect: null})
    }

    isAdmin = () => {
        return (this.state.user.role === "owner");
    }

    render (){

        let strings = new LocalizedStrings({
          en:{
            pleaseLogin: "Please log in to access this page."
          },
          es: {
            pleaseLogin: "Favor de iniciar sesión para ingresar a esta página."
          }
         });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        } 
        strings.setLanguage(language);
        Axios.interceptors.response.use(
            response => response,
            error => {
                console.log(error)
                const {status} = error.response;
                if (status === 401){
                    this.setState({redirect: "/"})
                    this.logoutHandler();
                    this.setAlerts([{
                      title: strings.pleaseLogin,
                      classes: ["danger"]
                    }])
                } else if (status === 403) {
                  this.setState({redirect: "/"})
                  this.setAlerts([{
                    title: "Acceso denegado",
                    classes: ["danger"],
                    message: null
                  }])
                } else if (status === 404) {
                    this.setState({redirect: "/"})
                    this.setAlerts([{
                      title: "La página no ha sido encontrada.",
                      classes: ["warning"],
                      message: null
                    }])
                } else if (status === 500) {
                    this.setAlerts([{
                      title: "Ha ocurrido un error en la comunicación con el servidor. Por favor intenta más tarde.",
                      classes: ["danger"],
                      message: null
                    }])
                  }
                return Promise.reject(error);
            }
        )


        
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
                    logout: this.logoutHandler,
                    isAdmin: this.isAdmin,
                    url: process.env.REACT_APP_API_ADDRESS}}>
                    <BrowserRouter>
                        <Switch>
                            <Route path="/invitado" render={() => (
                                <Invite/>
                            )} />
                            <Route path="/" render={() => (
                                <Aux>
                                    {this.state.user ? <LeftDrawer 
                                        backDropHandler={this.backDropHandler}
                                        open={this.state.showLeftDrawer} /> : null}
                                    <RightDrawer
                                        open={this.state.showRightDrawer}
                                        closed={this.rightDrawerHandler}
                                        init={this.state.initiateRightDrawer}
                                        backDropHandler={this.backDropHandler} />
                                    <Toolbar
                                        loggedIn ={this.state.user !== null}
                                        rightDrawer={this.rightDrawerHandler}
                                        leftDrawer={this.leftDrawerHandler} />
                                        <MainContainer user={this.state.user}>                        
                                            <App
                                                removeRedirect={this.removeRedirect}
                                                redirect={this.state.redirect} />
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
                                </Aux>
                            )} />
                        </Switch>
                    </BrowserRouter>
                </AuthContext.Provider>
            </urlContext.Provider>

        )
    }
}

export default Layout