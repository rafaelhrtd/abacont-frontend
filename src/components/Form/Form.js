import React, { Component } from 'react';
import classes from './Form.css'
import ErrorMessages from '../../UI/ErrorMessages/ErrorMessages'
import Aux from '../../hoc/Aux/Aux'
import Search from '../../UI/FormSearch/Search'
import ConditionalFormTag from './ConditionalFormTag'
// needs changed, submit, inputs, and errors props

class Form extends Component {
    innerStateSetup = () => {
        let inForms = {}
        Object.keys(this.props.inputs).map(key => {
            if (this.props.inputs[key].search === true) {
                inForms[this.props.inputs[key].kind] = false
            }
        })
        return inForms
    }

    state = {
        innerForms: this.innerStateSetup()
    }

    showInnerForm = (state) => {
        this.setState(prevState => {
            const newState = {...prevState}
            newState[state] = !newState[state]
            return (
                {[state]: newState}
            )
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            JSON.stringify(this.state.innerForms) !== JSON.stringify(nextState.innerForms) || 
            JSON.stringify(this.props.errors) !== JSON.stringify(nextProps.errors) ||
            JSON.stringify(this.props.previousValues) !== JSON.stringify(nextProps.previousValues)
        )
    }

    clickedAddHandler = (input) => {
        this.props.removeChild(this.props.suffix + input.name)
        this.setState(prevState => {
            let inForms = {...(prevState.innerForms)}
            inForms[input.kind] = !prevState.innerForms[input.kind]
            return({innerForms: inForms})
        })
        this.addHiddenInputsToParentState(input)
    }
    addHiddenInputsToParentState = (input) => {
        let form_elements = input.form_elements
        Object.keys(form_elements).map(key => {
            if (form_elements[key].inputType === "hidden"){
                this.props.clicked((this.props.suffix + input.suffix), form_elements[key])
            }
        })
    }


    render(){
        const dynamicClasses = {
        }   
    
        Object.keys(this.props.errors).map(elKey => {
            dynamicClasses[elKey] = "error"
            return 0
        })
        return (
            <Aux>
                {
                    !this.props.child ? (
                        <ErrorMessages errors={this.props.errors} />
                    ) : null
                }
                <div className={classes.Form}>
                    <ConditionalFormTag child={this.props.child}>
                        {
                            Object.keys(this.props.inputs).map(inputKey => {
                                if (this.props.inputs[inputKey].search === true){
                                    const input = this.props.inputs[inputKey]
                                    return(<Aux key={inputKey}>
                                        {!this.state.innerForms[input.kind] ? (
                                            <Search
                                                current_input={input}
                                                kind={input.kind}
                                                name={this.props.suffix + input.name}
                                                data={input.data}
                                                url={input.url}
                                                className={classes[dynamicClasses[this.props.suffix + input.kind]]}
                                                clickedAdd={this.clickedAddHandler}
                                                key={inputKey}
                                                givenID={input.id}
                                                edit={input.edit}
                                                givenName={input.givenName}
                                                changed={this.props.changed}
                                                placeholder={input.placeholder} />
                                        ):(
                                                <div className={classes.innerForm}>
                                                    <h3>{input.placeholder_suffix}</h3>
                                                    {   
                                                        <Form
                                                            changed={this.props.changed}
                                                            child={true}
                                                            suffix={this.props.suffix + input.suffix}
                                                            inputs={input.form_elements}
                                                            errors={this.props.errors}
                                                            removeChild={this.props.removeChild}
                                                            clicked={this.props.clicked}
                                                            previousValues={this.props.previousValues}
                                                        />
                                                    }       
                                                </div>
                                        )}
                                            </Aux>)
                                } else {
                                    const name = this.props.suffix + this.props.inputs[inputKey].name
                                    let input = this.props.inputs[inputKey]
                                    input["blank"] = input.blank === undefined ? true : false
                                    if (input.inputType === "textarea"){
                                        return (
                                            <textarea 
                                                key={inputKey}
                                                type={input.inputType} 
                                                name={name}
                                                placeholder={input.placeholder}
                                                className={classes[dynamicClasses[this.props.suffix + input.name]]}
                                                value={this.props.previousValues[name]}
                                                onChange={(event) => this.props.changed(event, null, input)} />
                                        )
                                    } else {
                                        return (
                                            <input 
                                            key={inputKey}
                                            type={input.inputType} 
                                            name={name}
                                            placeholder={input.placeholder}
                                            className={classes[dynamicClasses[this.props.suffix + input.name]]}
                                            value={this.props.previousValues[name]}
                                            onChange={(event) => this.props.changed(event, null, input)}></input>
                                        )
                                    }
                                }
                            })
                        }
                        {
                            this.props.child === undefined ? (
                                <input type="submit" onClick={event => this.props.submit(event, this.props.edit)} value={this.props.submitText} className="btn-success" />
                                ) : null
                        }
                    
                    </ConditionalFormTag>
                </div>
                
            </Aux>
        )

    }
    
}

export default Form;