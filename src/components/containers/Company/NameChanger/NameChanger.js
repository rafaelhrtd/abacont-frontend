import React, {Component} from 'react';
import Modal from '../../../../UI/Modal/Modal';
import AuthContext from '../../../../context/auth-context';
import classes from './NameChanger.css';
import Axios from 'axios';
import Aux from '../../../../hoc/Aux/Aux';
import { Edit } from 'react-feather';

class NameChanger extends Component {
    state = {
        showModal: false,
        name: this.props.company.name,
        error: true
    }

    static contextType = AuthContext;

    showHandler = () => {
        this.setState(prevState => {return {showModal: !prevState.showModal}})
    }

    successHandler = (data) => {
        this.context.updateUserInfo()
        this.setState({name: data.company.name})
        this.props.contextChange(data.company)
        this.context.toggleLoader()
        this.showHandler()
    }

    errorHandler = (data) => {
        this.context.toggleLoader()
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            error: false
        })
        if (event.target.value == "" || event.target.value == this.props.company.name) {
            this.setState({error: true})
        }
    }

    submitForm = (event) => {
        event.preventDefault()
        this.context.toggleLoader("Guardando cambios")
        if (this.state.error){
            this.setState({error: true})
        } else {
            const url = process.env.REACT_APP_API_ADDRESS + "/companies/" + this.props.company.id
            const data = {
                company: {
                    name: this.state.name
                }
            }
            Axios.patch(url, data).then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        this.successHandler(response.data)
                    } else {
                        this.errorHandler(response.data)
                    }
                }
            }, error => {
                setTimeout(()=>{
                    window.location.href = "/"
                },40000)
            })
        }
    }

    render(){
        return(
            <Aux>
                <Edit onClick={this.showHandler} />
                <Modal 
                    showHandler={this.showHandler}
                    show={this.state.showModal}>
                    <div className={classes.NameChanger}>
                        <h2>Editar compañía</h2>
                        <form onSubmit={(event) => this.submitForm(event)}>
                            <input 
                                type="text" 
                                name="name"
                                onChange={this.changeHandler} 
                                placeholder="Nombre" 
                                value={this.state.name}
                                className={this.state.error ? classes.error : null} />
                            <input 
                                type="submit" 
                                value="Guardar cambios"
                                className={this.state.error ? classes.disabled : null} />
                        </form>
                    </div>
                </Modal>
            </Aux>
        )
    }
}

export default NameChanger