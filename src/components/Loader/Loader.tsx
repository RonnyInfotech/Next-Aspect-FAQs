import * as React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div>
            <RotatingLines
                width="80"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                visible={true}
            />
        </div>
    );
};

export default Loader;