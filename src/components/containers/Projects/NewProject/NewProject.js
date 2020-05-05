import React from 'react';
import FormHolder from '../../../../helpers/FormHolder';
import classes from './NewProject.css'
import NewContact from '../../Contacts/NewContact/NewContact'

class NewProject extends FormHolder {
    static formElements = (suffix = null) => {
        let inputs = {
            name: {
                inputType: "text",
                name: "name",
                placeholder: "Nombre",
                blank: false
            },
            description: {
                inputType: "textarea",
                name: "description",
                placeholder: "Descripción"
            },
            value: {
                inputType: "text",
                name: "value",
                placeholder: "Valor total",
                blank: false
            },
            contact_id: {
                kind: "contact",
                name: "contact_id",
                suffix: "contact.",
                data: {
                    category: "client"
                },
                clicked_add: this.clickedAddHandler,
                url: 'contacts',
                search: true,
                placeholder: "Cliente",
                form_elements: NewContact.formElements("client"),
                input_suffix: "contact.",
                placeholder_suffix: "Nuevo cliente:",
                child: true
            },
            bill_number: {
                inputType: "text",
                name: "bill_number",
                placeholder: "Número de factura"
            }
        }
        return inputs
    }

    render(){
        return(
            <h1>New Project</h1>
        )
    }
}
export default NewProject