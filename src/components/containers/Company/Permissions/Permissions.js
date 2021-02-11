import React from "react";
import classes from "./Permissions.css";
import CheckBox from '../../../../UI/FormElements/CheckBox/CheckBox'
import Aux from '../../../../hoc/Aux/Aux';
import LocalizedStrings from 'react-localization';

const permissions = (props) => {
    let strings = new LocalizedStrings({
        en:{
            canRead: "Reading",
            canWrite: "Writing",
            canEdit: "Editing and deleting",
            canInvite: "Inviting (all other privileges are required)"
        },
        es: {
            canRead: "Lecture",
            canWrite: "Escritura",
            canEdit: "Edición y eliminación",
            canInvite: "Invitación (se requieren todos los permisos)"
        }
       });
    let language = navigator.language;
    if (localStorage.getItem('language') !== null){
        language = JSON.parse(localStorage.getItem('language'));
    } else if (JSON.parse(sessionStorage.getItem('language')) !== null){
        language = JSON.parse(sessionStorage.getItem('language'));
    }

    language = language ? language : "en"
    strings.setLanguage(language)
    return (
        <Aux>
            <CheckBox  
                givenClass={classes.privilege}
                name={'can_read'}
                text={strings.canRead}
                changed={props.changeHandler}
                disabled={true}
                initVal={props.can_read} />
            <CheckBox  
                givenClass={classes.privilege}
                name={'can_write'}
                text={strings.canWrite}
                initVal={props.can_write}
                changed={props.changeHandler}/>
            <CheckBox  
                givenClass={classes.privilege}
                name={'can_edit'}
                initVal={props.can_edit}
                text={strings.canEdit}
                changed={props.changeHandler}/>
            <CheckBox  
                givenClass={classes.privilege}
                name={'can_invite'}
                text={strings.canInvite}
                changed={props.changeHandler}
                disabled={props.inviteDisabled}
                initVal={props.can_invite} />
        </Aux>
    )
}

export default permissions
