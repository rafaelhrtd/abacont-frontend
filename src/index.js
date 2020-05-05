import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from './hoc/Layout/Layout';
import registerServiceWorker from './registerServiceWorker';
import Axios from 'axios';

Axios.interceptors.request.use(function(config) {
    const token = sessionStorage.getItem('jwtToken')
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
