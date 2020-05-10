import React from 'react';
import ReactLoading from 'react-loading';
import classes from './Loader.css'

const Loader = (props) => {
    const loaderClasses = [classes.Backdrop]
    if (props.show){
        loaderClasses.push(classes.Show)
    }
    return (
        <div className={loaderClasses.join(" ")}>
            <div className={classes.holder}>
                {props.title !== undefined && props.title !== null ? (
                    <h2>{props.title}</h2>
                ) : null}
                <ReactLoading type='spinningBubbles' color="#0087ff" height={100} width={100} />
            </div>
        </div>
    )
}

export default Loader