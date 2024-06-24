import * as React from 'react';
export const navigationRef = React.createRef();
export const navigate = (name, params) =>{
    console.log("navigationRef", navigationRef.current);
    navigationRef.current?.navigate(name, params);
}