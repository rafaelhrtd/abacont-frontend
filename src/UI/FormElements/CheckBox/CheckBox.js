import React, { Component } from 'react';
import classes from './CheckBox.css'


class CheckBox extends Component {
    state = {}

    componentDidMount = () => {
        this.setState({
            [this.props.name] : this.props.initVal
        })
    }

    clickedHandler = (e) => {
        if (!this.props.disabled){
            e.preventDefault();
            const data = {
                name: this.props.name,
                value: !this.state[this.props.name]
            }
            this.props.changed(null, data)
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.initVal !== this.props.initVal) {
            this.setState({
                [this.props.name] : this.props.initVal
            })
        }
    }

    render(){
        let checkboxClasses = [classes.Checkbox]
        let checkmarkClasses = [classes.Checkmark]
        if (this.props.disabled){
            checkboxClasses.push(classes.disabled)
            checkmarkClasses.push(classes.disabled)
        }

        return (
            <div className={this.props.givenClass}>
                <div>
                    {/* the onclick handler needs to be attached to both label and inner input, because it will trigger both 
                        and then will trigger the label's handler again. Needs to be an odd number */}
                    <label className={checkboxClasses.join(" ")} onClick={e => this.clickedHandler(e)} >
                        <div >
                        {this.props.text}
                        </div>
                        <input type="checkbox" name={this.props.name} value={this.state[this.props.name]} checked={this.state[this.props.name]}/>
                        <span pointerEvents='none' className={checkmarkClasses.join(" ")} name={this.props.name}></span>
                    </label>
                </div>
            </div>
        );
    }
}

export default CheckBox