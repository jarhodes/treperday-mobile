import React from 'react';
import ApiContext from './ApiContext';

export default function ApiState(props) {

    const apiVariables = React.useContext(ApiContext);
    const [user, setUser] = React.useState(props.user);

    return (<ApiContext.Provider 
        value={{apiUrl: apiVariables.apiUrl,
                apiKey: apiVariables.apiKey,
                user: user,
                setUser: setUser,
                authHeaders: props.authHeaders}}>
                {props.children}
            </ApiContext.Provider>);
}