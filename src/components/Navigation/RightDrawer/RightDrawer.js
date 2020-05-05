import React from 'react';
import classes from './RightDrawer.css'
import UserInfo from '../../User/UserInfo'
import Backdrop from '../../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/Aux/Aux'

const RightDrawer = (props) => {
    let attachedClasses = [classes.RightDrawer, classes.Closed]
    if (props.open) {
        attachedClasses = [classes.RightDrawer, classes.Open]
    }
    if (props.init && !props.open) {
        attachedClasses = [classes.RightDrawer, classes.Initiate]
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.backDropHandler} init={props.init} />
            <div className={attachedClasses.join(" ")}>
                <UserInfo />
            </div>
        </Aux>
    )
}

export default RightDrawer