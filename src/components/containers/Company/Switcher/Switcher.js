import React, { Component } from 'react';
import Modal from '../../../../UI/Modal/Modal';
import classes from './Switcher.css';
import Axios from 'axios';
import Aux from '../../../../hoc/Aux/Aux';
import Button from '../../../../UI/Buttons/Button/Button'

import AuthContext from '../../../../context/auth-context';

class Switcher extends Component {
    state = {
        showModal: false
    }

    static contextType = AuthContext;

    showHandler = () => {
        this.setState(prevState => {return {showModal: !prevState.showModal}})
    }

    successHandler = (data) => {
        this.context.updateUserInfo()
        this.props.clicked(data.company)
        this.setState({showModal: false})
        this.context.toggleLoader()
    }

    errorHandler = (data) => {
        console.log(data)
    }

    componentDidMount = () => {
        if (this.state.companies === undefined) {
            this.getCompanies();
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.companies === undefined) {
            this.getCompanies();
        }
    }
    
    changeCompany = (id) => {
        this.context.toggleLoader("Cambiando compañía")
        const url = process.env.REACT_APP_API_ADDRESS + "/switch-company"
        const data = {
            id: id
        }
        Axios.get(url, {params: {...data}})
            .then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        this.successHandler(response.data)
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

    setCompanies = (data) => {
        this.setState({companies: data.companies})
    }

    getCompanies = () => {
        const url = process.env.REACT_APP_API_ADDRESS + "/companies"
        Axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        this.setCompanies(response.data)
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

    render() {

        const companies = this.state.companies !== undefined ? (
            this.state.companies.map(company => (
                <li key={company.id} onClick={() => this.changeCompany(company.id)}>
                    {company.name}
                </li>
            ))
        ) : null
        return (
            <Aux>
                <Button className="primary" onClick={this.showHandler}>Cambiar compañía</Button>
                <Modal 
                    show={this.state.showModal}
                    className={classes.switchCompany}
                    showHandler={this.showHandler}>
                    <ul>
                        {companies}
                    </ul>
                </Modal>
            </Aux>
        )
    }
}

export default Switcher;