import * as React from 'react';
import { RotatingLines } from 'react-loader-spinner';
import './AppLoader.css';

const AppLoader = () => {
    return (
        <div className='loader-wrapper'>
            <RotatingLines
                width="80"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                visible={true}
            />
            <div className='setup-message mt-2'>
                Thank you for being so patient! We're setting up the app for the first time to provide you with the best experience. We'll be up and running in no time!
            </div>
        </div>
    );
};

export default AppLoader;