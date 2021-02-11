import React, { Component } from 'react';
import classes from './MonthSelector.css'
import LocalizedStrings from 'react-localization';


class MonthSelector extends Component {
    static months = () => {
        let strings = new LocalizedStrings({
          en:{
            jan: "January",
            feb: "February",
            mar: "March",
            apr: "April",
            may: "May",
            jun: "June",
            jul: "July",
            aug: "August",
            sep: "September",
            oct: "October",
            nov: "November",
            dec: "December"
          },
          es: {
            jan: "Enero",
            feb: "Febrero",
            mar: "Marzo",
            apr: "Abril",
            may: "Mayo",
            jun: "Junio",
            jul: "Julio",
            aug: "Agosto",
            sep: "Septiembre",
            oct: "Octubre",
            nov: "Noviembre",
            dec: "Diciembre"
          }
         });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        language = language ? language : "en"
        strings.setLanguage(language);
        return ([
            strings.jan,
            strings.feb,
            strings.mar,
            strings.apr,
            strings.may,
            strings.jun,
            strings.jul,
            strings.aug,
            strings.sep,
            strings.oct,
            strings.nov,
            strings.dec
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
        month: null,
        year: null,
        months: MonthSelector.months(),
        yearly: false
    }

    setTime = () => {
        this.setState({
            month: this.props.month === undefined ? (new Date).getMonth() : this.props.month,
            year: this.props.year === undefined ? (new Date).getFullYear() : this.props.year,
            yearly: this.props.yearly === undefined ? false : this.props.yearly
        })
    }

    componentDidMount = () => {
        this.setTime();
    }

    componentDidUpdate = (prevProps) => {
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)){
            this.setTime();
        }
    }

    render(){

        let strings = new LocalizedStrings({
            en:{
                annual: "Annual",
                monthly: "Monthly"
            },
            es: {
                annual: "Anual",
                monthly: "Mensual"
            }
        });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = JSON.parse(localStorage.getItem('language'));
        } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
            language = JSON.parse(sessionStorage.getItem('language'));
        }
        language = language ? language : "en"
        strings.setLanguage(language);
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
                    {this.state.yearly ? strings.monthly : strings.annual}
                </div>
            </div>
            
        )
    }
}

export default MonthSelector