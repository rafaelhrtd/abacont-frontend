import React from 'react';
import Getter from '../../../helpers/Getter';
import classes from './ExcelButton.css';
import ExcelLogo from '../../../assets/images/excel.png';
import ExcelMaker from './ExcelMaker/ExcelMaker';

class ExcelButton extends Getter {
    state = {
        transactions: null,
        toggleClick: 0
    }
    componentDidMount = () => {
        if (this.props.project_id){
            this.setState({project_id: this.props.project_id})
        }
    }

    successHandler = (data) => {
        this.setState({
            transactions: data.transactions
        });
        this.setState(prevState => {return {toggleClick: prevState.toggleClick+1}})
        this.context.toggleLoader()
    }

    errorHandler = () => {
        this.setState({commError: true});
    }

    clickedLogo = () => {
        this.context.toggleLoader("Generando archivo de Excel")
        let url = process.env.REACT_APP_API_ADDRESS + "transactions"
        let data = {
            month: this.props.month,
            year: this.props.year,
            yearly: this.props.yearly,
            xlsx: true
        }
        if (this.props.project_id){
            data.project_id = this.props.project_id
        }
        if (!this.state.commError){
            this.getServerInfo(url, data, this.errorHandler, this.successHandler)
        }
    }


    
    render(){
        return (
            <div className={classes.ExcelButton}>
                <img src={ExcelLogo} onClick={this.clickedLogo}/>
                <ExcelMaker
                    transactions={this.state.transactions}
                    yearly={this.props.yearly}
                    kind={this.props.kind}
                    key={this.state.toggleClick}
                    innerKey={this.state.toggleClick} />
            </div>
        )
    }
}

export default ExcelButton;
