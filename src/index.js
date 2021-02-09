import React from 'react';
import ReactDOM from 'react-dom';
import './index.global.css';
import Layout from './hoc/Layout/Layout';
import registerServiceWorker from './registerServiceWorker';
import Axios from 'axios';

Axios.interceptors.request.use(function(config) {
    let token = ""
    let language = sessionStorage.getItem('language') !== null ? sessionStorage.getItem('language') : "en";
    if (sessionStorage.getItem('jwtToken') !== null){
        token = sessionStorage.getItem('jwtToken')
    } else if (localStorage.getItem('jwtToken') !== null) {
        token = localStorage.getItem('jwtToken')
    }
    if ( token != null ) {
        config.headers.Authorization = token;
    } else {
        delete config.headers.Authorization
    }
    if ( token != null ) {
        config.headers.Authorization = token;
    } else {
        delete config.headers.Authorization
    }
    return config;
}, function(error) {
    return Promise.reject(error);
}
)


ReactDOM.render(<Layout />, document.getElementById('root'));
registerServiceWorker();
