import React, { Component } from 'react';
import axios from 'axios';

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
                console.log(url)
                console.log("fuck")
                console.log(error)
                setTimeout(()=>{
                    window.location.href = "/"
                },0)
            })
    }

    parseQuery = () => {
        const result = {}
        this.props.location.search.split("?").map(query => {
            if (query.length > 0) {
                result[query.split("=")[0]] = query.split("=")[1]
            }
        })
        return result;
    }


    updateQuery = () => {
        this.setState({query: {
            yearly: this.state.yearly,
            month: this.state.month,
            category: this.props.category,
            page: this.state.page,
            year: this.state.year,
            contact_id: this.state.contact_id,
            project_id: this.state.project_id,
            parent_id: this.state.parent_id
        }}, () => {
            this.pushQuery()
            this.getServerInfo(this.getUrl(),
                               this.state.query,
                               this.errorHandler,
                               this.successHandler)
        })
    }
}

export default Getter;