import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function withNavigation(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        const location = useLocation();

        // Using useEffect to navigate on mount or based on props change
        useEffect(() => {
            if (props.shouldNavigate && props.targetPath) {
                navigate(props.targetPath);
            }
        }, [navigate, props.shouldNavigate, props.targetPath]);

        return <Component {...props} navigate={navigate} location={location} />;
    };
}
