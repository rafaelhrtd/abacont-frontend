import React from 'react';
import classes from './Form.css'
import ErrorMessages from '../../../../UI/ErrorMessages/ErrorMessages'
import Aux from '../../../../hoc/Aux/Aux'
import Button from '../../../../UI/Buttons/Button/Button'

const Form = (props) => {
    const dynamicClasses = {
        first_name: [],
        last_name: [],
        email: [],
        "company.name" : [],
        language: [],
        password: [],
        password_confirmation: [] 
    }

    const languages = [
        {value: "en", label: "Inglés"},
        {value: "es", label: "Español"}
    ]
    

    Object.keys(props.errors).map(elKey => {
        dynamicClasses[elKey] = "error"
    })

    return (
        <Aux>
            <ErrorMessages errors={props.errors} />
            <div className={classes.Form}>
                <form>
                    {props.edit !== true ? (
                        <Aux>
                            <input 
                                type="text" 
                                name="first_name"
                                placeholder={props.strings.name}
                                className={classes[dynamicClasses.first_name]}
                                onChange={(event) => props.changed(event)}></input>
                            <input 
                                type="text" 
                                name="last_name"
                                placeholder={props.strings.lastName}
                                className={classes[dynamicClasses.last_name]}
                                onChange={(event) => props.changed(event)}></input>
                        </Aux>
                    ) : null}
                    <input 
                        type="email" 
                        name="email"
                        placeholder={props.strings.email}
                        className={classes[dynamicClasses.email]}
                        value={props.email}
                        onChange={(event) => props.changed(event)}></input>
                    {props.edit !== true ? (
                        <input 
                            type="text" 
                            name="company.name"
                            placeholder={props.strings.company}
                            className={classes[dynamicClasses["company.name"]]}
                            onChange={(event) => props.changed(event)}></input>
                    ) : null}
                    <select onChange={(event) => props.changed(event)} name="language">
                        <option value="en">{props.strings.english}</option>
                        <option value="es">{props.strings.spanish}</option>
                    </select>


                    {props.edit === true ? (
                        <input 
                            type="password" 
                            name="current_password"
                            placeholder={props.strings.currentPassword}
                            className={classes[dynamicClasses.current_password]}
                            onChange={(event) => props.changed(event)}></input>
                    ) : null}
                    <input 
                        type="password" 
                        name="password"
                        placeholder={props.strings.password}
                        className={classes[dynamicClasses.password]}
                        onChange={(event) => props.changed(event)}></input>

                    <input 
                        type="password" 
                        name="password_confirmation"
                        placeholder={props.strings.confirmPassword}
                        className={classes[dynamicClasses.password_confirmation]}
                        onChange={(event) => props.changed(event)}></input>
                    
                    <input type="submit" onClick={props.submit} value={props.edit ? props.strings.saveChanges : props.strings.createAccount} className="btn-success" />
                    
                    <Button onClick={props.backHandler}>
                        {props.strings.back}
                    </Button>
                </form>
            </div>
            
        </Aux>
    )
}

export default Form;