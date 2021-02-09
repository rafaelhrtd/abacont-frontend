import React, { Component } from 'react';
import classes from './PageSelector.css'


class PageSelector extends Component {
    state = {
        page: 1,
        totalPages: 1
    }

    componentDidMount = () => {
        this.setState({
            page: this.props.page,
            totalPages: this.props.totalPages})
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
            this.setState({
                page: this.props.page,
                totalPages: this.props.totalPages})
        }
    }

    addPageHandler = () => {
        this.setState(prevState => {
            if (prevState.page != prevState.totalPages){
                return {page: parseInt(prevState.page) + 1}
            }
        }, () => {
            this.props.changePageHandler(this.state.page)
        })
    }

    removePageHandler = () => {
        this.setState(prevState => {
            if (prevState.page != 1){
                return {page: parseInt(prevState.page) - 1}
            }
        }, () => {
            this.props.changePageHandler(this.state.page)
        })
    }
    changePageHandler = (event) => {
        this.setState({page: event.target.value})
        this.props.changePageHandler(event.target.value)
    }

    render(){
        let previousPageClasses = [classes.changer]
        let nextPageClasses = [classes.changer]
        if (parseInt(this.state.page) === parseInt(this.state.totalPages)) {
            nextPageClasses.push(classes.disabled)
        }

        if (parseInt(this.state.page) === 1) {
            previousPageClasses.push(classes.disabled)
        }

        return(

            <div className={classes.PageSelector}>
                <div className={previousPageClasses.join(" ")} onClick={this.removePageHandler}>{"<"}</div>
                <div className={classes.Page}>
                    <input
                        type="text"
                        onChange={(event) => this.changePageHandler(event)}
                        value={this.state.page}
                    /> / {this.state.totalPages}
                </div>
                <div className={nextPageClasses.join(" ")} onClick={this.addPageHandler}>{">"}</div>
            </div>
            
        )
    }
}

export default PageSelector;
