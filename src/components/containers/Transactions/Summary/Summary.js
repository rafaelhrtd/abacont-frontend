import React from "react"
import classes from "./Summary.css"

const summary = (props) => {
    const expected_total = (
        props.summary.receivable
        + props.summary.revenue
        - props.summary.payable
        - props.summary.expense
    )
    return(
        <div className={classes.Summary}>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.greenbg].join(" ")}><strong>Ingresos:</strong></div>
                <div className={classes.Value}>${props.summary.revenue.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.greenbg].join(" ")}><strong>Total por cobrar:</strong></div>
                <div className={classes.Value}>${props.summary.receivable.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.redbg].join(" ")}><strong>Egresos:</strong></div>
                <div className={classes.Value}>${props.summary.expense.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.redbg].join(" ")}><strong>Total por pagar:</strong></div>
                <div className={classes.Value}>${props.summary.payable.toFixed(2)}</div>
            </div>
            <div className={classes.Element}>
                <div className={[classes.Key, classes.greenbg].join(" ")}><strong>Total esperado:</strong></div>
                <div className={classes.Value}>${expected_total.toFixed(2)}</div>
            </div>
        </div>
    )
}

export default summary
