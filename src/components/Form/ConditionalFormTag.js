import React from 'react'
import Aux from '../../hoc/Aux/Aux'

const ConditionalFormTag = (props) => {
    if (props.child !== true) {
        return (
            <form>
                {props.children}
            </form>
        )
    } else {
        return (
            <Aux>
                {props.children}
            </Aux>
        )
    }
}

export default ConditionalFormTag