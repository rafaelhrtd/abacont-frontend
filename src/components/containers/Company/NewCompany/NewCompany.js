import React, {Component} from 'react';
import Button from '../../../../UI/Buttons/Button/Button';
import Modal from '../../../../UI/Modal/Modal';
import Axios from 'axios';
import AuthContext from '../../../../context/auth-context';
import LocalizedStrings from 'react-localization';
import classes from './NewCompany.css'

class NewCompany extends Component {
    state = {
        name: null,
        errors: {}
    }

    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                name: "Name",
                newCompany: "New company",
                createCompany: "Create company",
                creatingCompany: "Creating new company.",
                companyCreated: "Company created."
            },
            es: {
                name: "Nombre",
                newCompany: "Nueva compañía",
                createCompany: "Crear compañía",
                creatingCompany: "Creando compañía.",
                companyCreated: "Compañía creada."
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
        return strings;
    }
    
    static contextType = AuthContext;

    showHandler = () => {
        console.log("handler");
        this.setState(prevState => {return {showModal: !prevState.showModal}})
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

    componentDidMount = () => {
    }

    successHandler = (data) => {
        console.log("handler");
        this.context.toggleLoader(this.strings().creatingCompany);
        this.showHandler()
        this.context.setAlerts([
            {title: this.strings().companyCreated,
             classes: ["success"],
             message: null}
        ]);
        this.context.updateUserInfo();
        this.context.changeCurrentCompany(data.company);
        this.props.getContext();
    }

    errorHandler = (data) => {
        this.setState({errors: data.errors})
        this.context.toggleLoader(this.strings().creatingCompany);
    }

    commErrorHandler = (response) => {
        this.context.toggleLoader(this.strings().creatingCompany);
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.context.toggleLoader(this.strings().creatingCompany);
        const data = {
            company: {
                name: this.state.name
            }
        }
        const url = process.env.REACT_APP_API_ADDRESS + "/companies/create";
        Axios.post(url, {...data})
            .then(response => {
                if (response.status === 200) {
                    if (Object.keys(response.data.errors).length === 0){
                        this.successHandler(response.data)
                    } else {
                        this.errorHandler(response.data)
                    }
                }
            }, error => {
                this.commErrorHandler(error.response)
            })
    }


    render() {
        const nameClass = Object.keys(this.state.errors).length === 0 ? null : classes.error
        return (
            <div>
                <Button 
                    className="success"
                    onClick={this.showHandler}>
                    {this.strings().newCompany}
                </Button>
                <Modal
                    show={this.state.showModal}
                    showHandler={this.showHandler}
                    className={classes.Modal}
                    >
                    <h2>{this.strings().newCompany}</h2>
                        <form onSubmit={event => {this.submitHandler(event)}}>
                            <input 
                                name="name" 
                                type="text" 
                                placeholder={this.strings().name}
                                className={nameClass}
                                onChange={event => this.changeHandler(event)} />
                                {Object.keys(this.state.errors).map(key => (
                                    this.state.errors[key].map(error => (
                                        <p key={key} className={classes.error}>
                                            {error}
                                        </p>
                                    ))
                                ))}
                            <input type="submit" value={this.strings().createCompany} className="btn-success" />
                        </form>
                </Modal>
            </div>
        )
    }
}

export default NewCompany;