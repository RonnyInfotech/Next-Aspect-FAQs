import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AllFAQs from '../AllFAQs/AllFAQs';
import Header from '../Header/Header';
import AddFAQ from '../AddFAQ/AddFAQ';

const App = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<AllFAQs />} />
                <Route path="/manage-faq" element={<AddFAQ />} />
            </Routes>
        </div>
    );
};

export default App;