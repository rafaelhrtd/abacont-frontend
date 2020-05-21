import React, { Component, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/auth-context';

class FormHolder extends Component {
    static contextType = AuthContext;

    changeHandler = (event, data=null, input, old_data) => {
        let target_name = ""
        let form_data = {...this.state.form_data}
        if (event !== null) {
            event.persist()
            target_name = event.target.name
            form_data[event.target.name] = event.target.value
            if (event.target.value.length === 0 && input.blank === true &&
                [undefined, null].includes(old_data[event.target.name])){
                this.removeChildId(event.target.name)
                return
            }
        } else {
            form_data[data.name] = data.value
            target_name = data.name
            if (data.value.length === 0 &&
                [undefined, null].includes(old_data[data.name])){
                this.removeChildId(data.name);
                return
            }
        }
        // check if special select input should be deleted and do so
        if (input !== null && input !== undefined && input.input !== undefined && input.input !== null){
            const innerName = event.target.name.split(".")[0] + "." + input.input.name
            if (input.options[input.input.onOption] !== event.target.value){
                form_data[innerName] = ""
            }
        }
        this.setState((prevState) => {
            let errors = {...prevState.errors}
            if (errors[target_name] !== undefined){
                delete errors[target_name]
            }
            return({
                errors: errors,
                form_data: form_data
            })
        })
    }

    clickedAddHandler = (suffix, input) => {
        let name = suffix + input.name
        this.setState(prevState => {
            let data = {...prevState}
            data.form_data[name] = input.value
            return({form_data: data.form_data})
        })
    }



    getPreviousValues(object, suffix){
        let form_data = {}
        Object.keys(object).map(key => {
            form_data[suffix + key] = object[key]
        })
        // fix weird decimals
        Object.keys(form_data).map(key => {
            if (typeof(form_data[key]) === "number"){
                form_data[key] = form_data[key].toFixed(2);
            }
        })
        this.setState({form_data: form_data, old_data: form_data})
    }
    
    removeChildId = (child) => {
        const form_data = {...this.state.form_data}
        this.setState(() => {
            delete form_data[child]
            return({form_data: form_data})
        })
    }

    setUpData = (inputData) => {
        let data = {}
        let holder = {}
        let secondHolder = holder
        Object.keys(inputData).map((key) => {
            secondHolder = holder
            key.split(".").map((word, i)=>{
                if (i !== 0 && (i != key.split(".").length - 1)){
                    word = word + "_attributes"
                }
                if (secondHolder[word] === undefined){
                    if (i === key.split(".").length - 1) {
                        secondHolder[word] = inputData[key]
                    } else {
                        secondHolder[word] = {}
                        secondHolder = secondHolder[word]
                    }
                } else {
                    secondHolder = secondHolder[word]
                }
            })
        })
        data = {...data, ...holder}
        data = {...this.setCompanyId(data)}
        return(data)
    }

    // returns the errors in the format .transaction.contact.name
    setUpErrors = (errors, newErrors = {}, names = []) => {
        delete errors.errors
        Object.keys(errors).map(key => {
            if (!Array.isArray(errors[key])) {
                this.setUpErrors(errors[key], newErrors, [...names, key])
            } else {
                let newName = [...names, key].join(".")
                if (errors[key][0] === "no es válido"){
                    newErrors[newName] = errors[key][1]
                } else {
                    newErrors[newName] = errors[key][0]
                }
            }
        })
        return newErrors
    }

    setCompanyId = (data) => {
        Object.keys(data).map(key => {
            if (typeof(data[key]) === "object" && data[key] !== null){
                data[key]["company_id"] = this.context.user.company_id
                this.setCompanyId(data[key]);
            }
        })
        return data
    }



    submitHandler  = (event, url, data, successResponse, errorResponse, successUrl = null, edit = false) => {
        event.preventDefault();
    
        if (edit === false) {
            this.context.toggleLoader("Creando");
            axios.post(url, data)
                .then(response => {
                    this.context.toggleLoader("");
                    if (response.status === 200){
                        if (response.data.errors === undefined){
                            successResponse(response.data, successUrl)
                        } else {
                            errorResponse(this.setUpErrors(response.data))
                            console.log(response.data)
                        }
                    }
                }, error => {
                    console.log(error)
            })
        } else {
            this.context.toggleLoader("Guardando cambios");
            axios.patch(url, data)
                .then(response => {
                    this.context.toggleLoader("");
                    if (response.status === 200){
                        if (response.data.errors === undefined){
                            successResponse(response.data, successUrl)
                        } else {
                            errorResponse(this.setUpErrors(response.data))
                            console.log(response.data)
                        }
                    }
                }, error => {
                    console.log(error)
            })
        }

    
    }

    errorsHandler = (errors) => {
        this.setState({errors: errors})
    }
}

export default FormHolder