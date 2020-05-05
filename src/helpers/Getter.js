import React, { Component } from 'react';
import axios from 'axios'

class Getter extends Component {
    getServerInfo = (url, data, errorHandler, successHandler) => {
        axios.get(url, {params: {...data}})
            .then(response => {
                if (response.status === 200) {
                    if (response.data.errors === undefined){
                        successHandler(response.data)
                    } else {
                        errorHandler(response.data)
                    }
                }
            }, error => {
                console.log(error)
            })
    }
}

export default Getter;