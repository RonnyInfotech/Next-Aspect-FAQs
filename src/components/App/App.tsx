import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AllFAQs from '../AllFAQs/AllFAQs';
import Header from '../Header/Header';

const App = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<AllFAQs />} />
            </Routes>
        </div>
    );
};

export default App;