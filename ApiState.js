import React from 'react';
import ApiContext from './ApiContext';

export default function ApiState(props) {

    const apiVariables = React.useContext(ApiContext);

    return (<ApiContext.Provider 
        value={{apiUrl: apiVariables.apiUrl,
                apiKey: apiVariables.apiKey,
                user: props.user,
                authHeaders: props.authHeaders}}>
                {props.children}
            </ApiContext.Provider>);
}