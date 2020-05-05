import React from 'react';

const urlContext = React.createContext({
    url: process.env.REACT_APP_API_ADDRESS,
})

export default urlContext;