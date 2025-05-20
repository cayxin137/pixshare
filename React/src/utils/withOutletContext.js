import React from 'react';
import { useOutletContext } from 'react-router-dom';

export function withOutletContext(Component) {
    return function ComponentWithOutletContext(props) {
        const context = useOutletContext();
        return <Component {...props} {...context} />;
    };
}