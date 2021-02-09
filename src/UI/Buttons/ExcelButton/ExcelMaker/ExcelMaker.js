import React from "react";
import ReactExport from "react-export-excel";
import Aux from '../../../../hoc/Aux/Aux';
import LocalizedStrings from 'react-localization';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelRow = ReactExport.ExcelFile.ExcelRow;



class ExcelMaker extends React.Component {


    strings = () => {
        let strings = new LocalizedStrings({
          en:{
            finance: "Finance",
            summary: "Summary",
            revenues: "Revenues",
            accountsPayable: "Accounts payable",
            expenses: "Expenses",
            accountsReceivable: "Accounts receivable",
            currentBalance: "Current balance",
            expectedBalance: "Expected balance",
            month: "Month",
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
            dec: "December",
            billNumber: "Bill number",
            date: "Date",
            bill_number: "Bill number",
            payment_type: "Payment method",
            cheque_number: "Cheque number",
            description: "Description",
            provider: "Provider",
            client: "Client",
            project_name: "Project",
            amount: "Amount",
            balance: "Balance"
          },
          es: {
            finance: "Finanzas",
            summary: "Resumen",
            revenues: "Ingresos",
            accountsPayable: "Cuentas por pagar",
            expenses: "Egresos",
            accountsReceivable: "Cuentas por cobrar",
            currentBalance: "Utilidad bruta actual",
            expectedBalance: "Utilidad bruta esperada",
            month: "Mes",
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
            dec: "Diciembre",
            date: "Fecha",
            bill_number: "Factura",
            payment_type: "Método de pago",
            cheque_number: "Número de cheque",
            description: "Descripción",
            provider: "Proveedor",
            client: "Cliente",
            project_name: "Proyecto",
            amount: "Monto",
            balance: "Saldo"
          }
         });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        } 
        console.log(strings)
        return strings        
    }

    separateByMonth = (array) => {
        let months = [[],[],[],[],[],[],[],[],[],[],[],[]]
        array.map(object => {
            months[parseInt(object.date.split("-")[1]-1)].push(object)
        })

        return months;
    }

    setUpYearly = (transactions, empties, names) => {
        let expenseByMonth = this.separateByMonth(transactions.expense)
        let revenueByMonth = this.separateByMonth(transactions.revenue)
        let payableByMonth = this.separateByMonth(transactions.payable)
        let receivableByMonth = this.separateByMonth(transactions.receivable)

        let months = {}
        months[this.strings().jan] = {};
        months[this.strings().feb] = {};
        months[this.strings().mar] = {};
        months[this.strings().apr] = {};
        months[this.strings().may] = {};
        months[this.strings().jun] = {};
        months[this.strings().jul] = {};
        months[this.strings().aug] = {};
        months[this.strings().sep] = {};
        months[this.strings().oct] = {};
        months[this.strings().nov] = {};
        months[this.strings().dec] = {};

        Object.keys(Object.keys(months)).map(index => {
            months[Object.keys(months)[index]]['expense'] = expenseByMonth[index]
            months[Object.keys(months)[index]]['revenue'] = revenueByMonth[index]
            months[Object.keys(months)[index]]['payable'] = payableByMonth[index]
            months[Object.keys(months)[index]]['receivable'] = receivableByMonth[index]
        })

        const summary = this.yearlySummary(months)

        Object.keys(months).map(transactions => {
            months[transactions] = {...this.setUpObjects(empties, months[transactions])}
        })

        Object.keys(months).map(month => {
            let currentMonth = []
            months[month] = Object.keys(months[month]).map(tranType => {
                let titleObject = {
                    ySteps: tranType !== Object.keys(months[month])[0] ? 2 : 1,
                    xSteps: 1,
                    columns: [this.getTitle(tranType)],
                    data: [""]
                }
                currentMonth.push(titleObject)
                currentMonth.push(
                    {
                    xSteps: 1,
                    columns: Object.keys(names[tranType]).map(key => (
                        names[tranType][key]
                    )),
                    data: months[month][tranType].map(transaction => {
                        return (
                                Object.keys(names[tranType]).map(key => (
                                    transaction[key]
                                ))
                        )
                    })
                    }
                )
            })
            months[month] = currentMonth
        })
        return {months: months, summary: summary}
    }

    setUpMonthly = (transactions, empties, names) => {
        let summary = this.monthlySummary(transactions)
        let processedTransactions = {...this.setUpObjects(empties, transactions)}
        const final = Object.keys(processedTransactions).map(tranType => {
            console.log(processedTransactions)
            let columns = Object.keys(names[tranType]).map(key => {
                return (names[tranType][key])
            })
            let data = processedTransactions[tranType].map(transaction => (
                Object.keys(names[tranType]).map(key => {
                    return (transaction[key])
                })
            ))

            return([{title: this.getTitle(tranType), xSteps: 1, ySteps: 1, columns: columns, data: data}])
        })
        return {data: final, summary: summary}
    }

    monthlySummary = (transactions) => {
        const columns = [
            this.strings().revenues,
            this.strings().expenses,
            this.strings().accountsReceivable,
            this.strings().accountsPayable,
            this.strings().currentBalance,
            this.strings().expectedBalance
        ]

        let info = {}
        info.revenue = this.getTotal(transactions.revenue).total
        info.expense = this.getTotal(transactions.expense).total
        info.receivable = this.getTotal(transactions.receivable)
        info.payable = this.getTotal(transactions.payable)
        info.currentTotal = info.revenue - info.expense 
        info.expectedTotal = info.currentTotal + info.receivable.balance - info.payable.balance 
        const data = [[
            info.revenue,
            info.expense,
            info.receivable.balance,
            info.payable.balance,
            info.currentTotal,
            info.expectedTotal
        ]]
        return[{
            xSteps: 1,
            ySteps: 1,
            columns: columns,
            data: data
        }]
    }

    yearlySummary = (months) => {
        let columns = [
            this.strings().month,
            this.strings().expenses,
            this.strings().accountsReceivable,
            this.strings().accountsPayable,
            this.strings().currentBalance,
            this.strings().expectedBalance
        ]
        let data = []
        Object.keys(months).map(month => {
            let monthInfo = {}
            monthInfo.month = month
            monthInfo.revenue = this.getTotal(months[month].revenue).total
            monthInfo.expense = this.getTotal(months[month].expense).total
            monthInfo.receivable = this.getTotal(months[month].receivable)
            monthInfo.payable = this.getTotal(months[month].payable)
            monthInfo.currentTotal = monthInfo.revenue-monthInfo.expense
            monthInfo.expectedTotal = monthInfo.currentTotal + monthInfo.receivable.balance - monthInfo.payable.balance
            data.push([
                monthInfo.month,
                monthInfo.revenue,
                monthInfo.expense,
                monthInfo.receivable.balance,
                monthInfo.payable.balance,
                monthInfo.currentTotal,
                monthInfo.expectedTotal
            ]);
        })
        return [{xSteps: 1, ySteps: 1, columns: columns, data: data}]
    }

    getTotal = (array) => {
        let total = 0
        let balance = 0
        array.map(object => {
            total += object.amount
            balance += object.balance
        })
        return {
            total: total,
            balance: balance
        }
    }

    setUpObjects(empties, transactions){
        let expenses = [...transactions.expense]
        let revenues = [...transactions.revenue]
        let payables = [...transactions.payable]
        let receivables = [...transactions.receivable]
        let totalExpense = 0;
        let totalRevenue = 0;
        let totalPayableBal = 0;
        let totalReceivableBal = 0;
        let totalPayable = 0;
        let totalReceivable = 0;

        expenses.map(expense => {
            totalExpense += expense.amount
        })

        revenues.map(revenue => {
            totalRevenue += revenue.amount
        })

        payables.map(payable => {
            totalPayable += payable.amount
            totalPayableBal += payable.balance
        })
        
        receivables.map(receivable => {
            totalReceivable += receivable.amount
            totalReceivableBal += receivable.balance
        })

        let expenseTotal = {...empties.expense};
        expenseTotal.contact_name = "Total:"
        expenseTotal.amount = totalExpense
        expenses.push(empties.expense)
        expenses.push(expenseTotal)

        let revenueTotal = {...empties.revenue};
        revenueTotal.contact_name = "Total:"
        revenueTotal.amount = totalRevenue
        revenues.push(empties.revenue)
        revenues.push(revenueTotal)

        let payableTotal = {...empties.payable};
        payableTotal.contact_name = "Total:"
        payableTotal.amount = totalPayable
        payableTotal.balance = totalPayableBal
        payables.push(empties.payable)
        payables.push(payableTotal)

        let receivableTotal = {...empties.receivable};
        receivableTotal.contact_name = "Total:"
        receivableTotal.amount = totalReceivable
        receivableTotal.balance = totalReceivableBal
        receivables.push(empties.receivable)
        receivables.push(receivableTotal)

        let printables = {
            expense: expenses,
            revenue: revenues,
            payable: payables,
            receivable: receivables
        }

        return printables;
    }

    getTitle = (input) => {
        if (input == "receivable") {
            return this.strings().accountsReceivable
        } else if (input == "payable") {
            return this.strings().accountsPayable
        } else if (input == "expense") {
            return this.strings().expenses
        } else if (input == "revenue") {
            return this.strings().revenues
        } 
    }

    render() {
        let expenseData = null
        let innerExcel = null
        const empties = {
            expense:    {
                date: "",
                bill_number: "",
                payment_type: "",
                cheque_number: "",
                description: "",
                contact_name: "",
                project_name: "",
                amount: ""
                },
            revenue: {
                date: "",
                bill_number: "",
                payment_type: "",
                description: "",
                contact_name: "",
                project_name: "",
                amount: ""
            },
            payable: {
                date: "",
                bill_number: "",
                payment_type: "",
                description: "",
                contact_name: "",
                project_name: "",
                amount: "",
                balance: ""
            },
            receivable: {
                date: "",
                bill_number: "",
                payment_type: "",
                description: "",
                contact_name: "",
                project_name: "",
                amount: "",
                balance: ""
            }
        }

        const names = {
            expense: {
                date: this.strings().date,
                bill_number: this.strings().bill_number,
                payment_type: this.strings().payment_type,
                cheque_number: this.strings().cheque_number,
                description: this.strings().description,
                contact_name: this.strings().provider,
                project_name: this.strings().project_name,
                amount: this.strings().amount
            },

            revenue: {
                date: this.strings().date,
                bill_number: this.strings().bill_number,
                payment_type: this.strings().payment_type,
                description: this.strings().description,
                contact_name: this.strings().client,
                project_name: this.strings().project_name,
                amount: this.strings().amount
            },

            payable: {
                date: this.strings().date,
                bill_number: this.strings().bill_number,
                payment_type: this.strings().payment_type,
                description: this.strings().description,
                contact_name: this.strings().provider,
                project_name: this.strings().project_name,
                amount: this.strings().amount,
                balance: this.strings().balance
            },

            receivable: {
                date: this.strings().date,
                bill_number: this.strings().bill_number,
                payment_type: this.strings().payment_type,
                description: this.strings().description,
                contact_name: this.strings().client,
                project_name: this.strings().project_name,
                amount: this.strings().amount,
                balance: this.strings().balance
            },
        }
        if (this.props.transactions === null || this.props.innerKey === 0) {
            return null
        } else if (this.props.transactions !== null && this.props.kind === "transactions" && this.props.yearly !== true){
            const data = this.setUpMonthly( this.props.transactions, empties, names)
            console.log(data)
            return (
                <ExcelFile hideElement={true}> 
                    <ExcelSheet dataSet={data.summary} name={this.strings().summary} />
                    {(data.data).map(dataSet => (
                        <ExcelSheet dataSet={dataSet} name={dataSet[0].title} />
                    ))}
                </ExcelFile>
            );
        } else if (this.props.transactions !== null && this.props.kind === "transactions" && this.props.yearly === true){
            let data = this.setUpYearly(this.props.transactions, empties, names)
            console.log(data)
            return (
                <ExcelFile hideElement={true}> 
                    <ExcelSheet dataSet={data.summary} name={this.strings().summary} />
                    {Object.keys(data.months).map(month => (
                        <ExcelSheet key={month} dataSet={data.months[month]} name={month} />
                    ))}
                </ExcelFile>                
            )
        }
    }
}

export default ExcelMaker;