import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AllFAQs from '../AllFAQs/AllFAQs';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AllFAQs />} />
            </Routes>
        </div>
    );
};

export default App;