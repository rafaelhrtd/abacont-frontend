import React, { Component } from 'react';
import classes from './Modal.css';

class Modal extends Component {
    state = {
        show: true
    }
    componentDidMount = () => {
        this.setState({show: this.props.show})
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.show !== this.props.show){ 
            this.setState({show: this.props.show})
        }
    }
    toggleDisplay = (event = null) => {
        if (event !== null && event.target === event.currentTarget){
            this.setState(prevState => {return {show: !prevState.show}})
            this.props.showHandler();
        }
    }
    
    render() {
        let backdropClasses = [classes.Backdrop]
        if (!this.state.show){
            backdropClasses.push(classes.hide)
        }
        let modalClass = [classes.content]
        if (this.props.className){
            modalClass.push(this.props.className)
        }
        return(
            <div className={backdropClasses.join(" ")} onClick={event => this.toggleDisplay(event)}>
                <div className={modalClass.join(" ")}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Modal;