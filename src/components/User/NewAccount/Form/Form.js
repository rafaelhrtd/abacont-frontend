import React from 'react';
import classes from './Form.css'
import ErrorMessages from '../../../../UI/ErrorMessages/ErrorMessages'
import Aux from '../../../../hoc/Aux/Aux'

const Form = (props) => {
    const dynamicClasses = {
        first_name: [],
        last_name: [],
        email: [],
        "company.name" : [],
        password: [],
        password_confirmation: [] 
    }
    

    Object.keys(props.errors).map(elKey => {
        dynamicClasses[elKey] = "error"
    })

    return (
        <Aux>
            <ErrorMessages errors={props.errors} />
            <div className={classes.Form}>
                <form>
                    <input 
                        type="text" 
                        name="first_name"
                        placeholder="Nombre"
                        className={classes[dynamicClasses.first_name]}
                        onChange={(event) => props.changed(event)}></input>
                    <input 
                        type="text" 
                        name="last_name"
                        placeholder="Apellido"
                        className={classes[dynamicClasses.last_name]}
                        onChange={(event) => props.changed(event)}></input>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email"
                        className={classes[dynamicClasses.email]}
                        onChange={(event) => props.changed(event)}></input>
                    <input 
                        type="text" 
                        name="company.name"
                        placeholder="Compañía"
                        className={classes[dynamicClasses["company.name"]]}
                        onChange={(event) => props.changed(event)}></input>
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Contraseña"
                        className={classes[dynamicClasses.password]}
                        onChange={(event) => props.changed(event)}></input>

                    <input 
                        type="password" 
                        name="password_confirmation"
                        placeholder="Confirmar contraseña"
                        className={classes[dynamicClasses.password_confirmation]}
                        onChange={(event) => props.changed(event)}></input>
                    <input type="submit" onClick={props.submit} value="Crear cuenta" className="btn-success" />
                </form>
            </div>
            
        </Aux>
    )
}

export default Form;