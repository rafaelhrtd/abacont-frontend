import React, { Component } from 'react';
import classes from './MonthSelector.css'


class MonthSelector extends Component {
    static months = () => {
        return ([
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ])
    }

    removeMonthHandler = () => {
        this.setState(prevState => {
            let month = prevState.month
            let year = prevState.year
            if (this.state.yearly){
                year -= 1;
            } else {
                if (month === 0) { 
                    month = 11
                    year -= 1
                } else {
                    month -= 1
                }
            }
            this.props.changeTime(month, year)
            return({
                month: month,
                year: year
            })
        })
    }

    addMonthHandler = () => {
        this.setState(prevState => {
            let month = prevState.month
            let year = prevState.year
            if (this.state.yearly){
                year += 1;
            } else {
                if (month === 11) { 
                    month = 0
                    year += 1
                } else {
                    month += 1
                }
            }
            this.props.changeTime(month, year)
            return({
                month: month,
                year: year
            })
        })
    }

    switchYearlyHandler = () => {
        this.setState(prevState => {return {yearly: !prevState.yearly}})
        this.props.switchedYearly()
    }

    state = {
        month: (new Date).getMonth(),
        year: (new Date).getFullYear(),
        months: MonthSelector.months(),
        yearly: false
    }

    render(){
        return(

            <div className={classes.MonthSelector}>
                <div className={classes.Selector}>
                    <div className={classes.changer} onClick={this.removeMonthHandler}>{"<<"}</div>
                    <div className={classes.MonthYear}>
                    {this.state.yearly ? 
                        this.state.year
                        : 
                        this.state.months[this.state.month] + " " + this.state.year
                    }
                    </div>
                    <div className={classes.changer} onClick={this.addMonthHandler}>{">>"}</div>
                </div>
                <div className={classes.MonthYear} onClick={this.switchYearlyHandler}>
                    {this.state.yearly ? "Mensual" : "Anual"}
                </div>
            </div>
            
        )
    }
}

export default MonthSelector