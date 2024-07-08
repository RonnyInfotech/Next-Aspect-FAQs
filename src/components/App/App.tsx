import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AllFAQs from '../AllFAQs/AllFAQs';
import Header from '../Header/Header';
import SubHeader from '../Header/SubHeader';
import AddFAQ from '../AddFAQ/AddFAQ';

const App = () => {
    const location = useLocation();

    return (
        <div>
            <Header />
            {/* {location.pathname !== '/manage-faq' && <SubHeader />} */}
            <Routes>
                <Route path="/" element={<AllFAQs />} />
                <Route path="/manage-faq" element={<AddFAQ />} />
            </Routes>
        </div>
    );
};

export default App;