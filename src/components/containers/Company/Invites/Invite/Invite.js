import React, { Component } from 'react';
import classes from './Invite.css'
import {XSquare, Send} from 'react-feather';
import Axios from 'axios';
import AuthContext from '../../../../../context/auth-context';
import Button from '../../../../../UI/Buttons/Button/Button'

class Invite extends Component {
    state = {
        hideResend: false
    }
    static contextType = AuthContext;
    commErrorHandler = (response) => {
        console.log(response);
    }

    resendInvite = (invite) => {
        this.setState({hideResend: true})
        const url = process.env.REACT_APP_API_ADDRESS + "resend_invite?id=" + invite.company_id + "&user_invite_id="+invite.id;
        Axios.get(url)
            .then(() => {
                console.log(this.props)
                this.props.getInvites();
                this.context.setAlerts([

                    {title: "Invitación reenviada.",
                    classes: ["success"],
                    message: null}

                ])
            }, error => {
                this.commErrorHandler(error.response)
            })
    }

    destroyInvite = (invite) => {
        const url = process.env.REACT_APP_API_ADDRESS + "delete_invite?id=" + invite.company_id + "&user_invite_id="+invite.id;
        Axios.get(url)
            .then(() => {
                console.log(this.props)
                this.props.getInvites();
                this.context.setAlerts([

                    {title: "Invitación eliminada.",
                    classes: ["success"],
                    message: null}

                ])
            }, error => {
                this.commErrorHandler(error.response)
            })
    }

    render(){
        const resendClasses = this.state.hideResend ? [classes.resend, classes.hide] : [classes.resend]
        return(
            <div className={classes.invite}>
                <div className={classes.email}>
                    {this.props.invite.email}
                </div>
                <div className={resendClasses.join(" ")} onClick={() => this.resendInvite(this.props.invite)}>
                    <Button className="primary">Reenviar</Button>
                </div>
                <div className={classes.delete} onClick={() => this.destroyInvite(this.props.invite)}>
                    <Button className="danger">Eliminar</Button>
                </div>
                
            </div>
        )

    }
}

export default Invite;