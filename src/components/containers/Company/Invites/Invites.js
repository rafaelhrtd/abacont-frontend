import React from 'react';
import classes from './Invites.css'
import Invite from './Invite/Invite'

const Invites = (props) => {
    return(
        <div className={classes.Invites}>
            {props.invites.map(invite => (
                <Invite 
                    key={invite.id} 
                    invite={invite}
                    getInvites={props.getInvites}/>
            ))}
        </div>
    )
}

export default Invites