import React from 'react'
import classes from './LoginForm.css';
import CheckBox from '../../../../UI/FormElements/CheckBox/CheckBox'
import LocalizedStrings from 'react-localization';

const loginForm = (props) => {
    let hasError = Object.keys(props.errorObjects).length > 0
    let emailClass = ""
    let passwordClass = ""
    if (!(props.errorObjects["email"] === undefined && props.errorObjects["form"] === undefined)){
        emailClass = "form-error"
    } 
    if (!(props.errorObjects["password"] === undefined && props.errorObjects["form"] === undefined)){
        passwordClass = "form-error"
    }

    let error_messages = null
    if (Object.keys(props.errorObjects).length > 0){
        error_messages = (
            <ul>
                {
                    Object.keys(props.errorObjects).map(errorKey => (
                        <li key={errorKey}>{props.errorObjects[errorKey]}</li>
                    ))
                }
            </ul>
        )
    }

    return (
        <div className={classes.LoginForm}>
            {hasError ? (
                <div className={classes.errors}>
                    {error_messages}
                </div>
            ) : null}
            <form className={classes.Form} onSubmit={(event) => props.login(event)}>
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email"
                    className={classes[emailClass]}
                    onChange={(event) => props.changed(event)}></input>
                <input 
                    type="password" 
                    name="password"
                    placeholder={props.strings.password}
                    className={classes[passwordClass]}
                    onChange={(event) => props.changed(event)}></input>
                <CheckBox 
                    givenClass={classes.checkbox} 
                    name="remember_me" 
                    text={props.strings.rememberMe}
                    changed={props.changed}
                    clicked={props.remember}
                    initVal={props.rememberMeVal} />
                <input type="submit" value={props.strings.loginButtonText} className="btn-success" />
            </form>
        </div>
    )
}

export default loginForm;