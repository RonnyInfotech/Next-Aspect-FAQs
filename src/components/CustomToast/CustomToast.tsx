import React from 'react';
import { ToastContainer } from 'react-toastify';

const CustomToast = () => {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
        />
    );
};

export default CustomToast;