import React, { useContext, useEffect, useState } from 'react';
import { ListBox } from 'primereact';
import { generateFaqData } from '../../common/commonFunction';
import { FAQsContext } from '../../context/FAQsContext';
import FAQSection from './FAQSection';
import './AllFAQ.css';

const AllFAQs = () => {
    const { FAQsItems, categories } = useContext(FAQsContext);
    const [selectedCategory, setSelectedCategory] = useState([]);

    useEffect(() => {
        if (categories.length > 0) {
            setSelectedCategory([categories[0]?.Title])
        }
    }, [categories]);

    const FAQData = generateFaqData(categories, FAQsItems);

    return (
        <div className="App">
            <h1 className='mt-0 font-medium' style={{ fontSize: '1.8rem' }}>Frequently asked questions</h1>
            <div className="faq-container">
                <div className='grid'>
                    <div className='faq-sidebar col-12 md:col-3 lg:col-3 flex justify-content-center'>
                        <div style={{ height: '41vh' }}>
                            <h3 className='mt-0 mb-2 ml-1 font-bold'>Categories</h3>
                            <ListBox
                                listStyle={{ maxHeight: '250px' }}
                                // multiple
                                // filter
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.value)}
                                options={categories}
                                optionLabel="Title"
                                optionValue='Title'
                                className="w-full md:w-14rem"
                            />
                        </div>
                    </div>
                    <div className='col-12 md:col-9 lg:col-9 faq-content'>
                        <div style={{ maxHeight: '52vh', overflow: 'auto', width: '95%' }}>
                            {FAQData?.filter(section => selectedCategory?.includes(section.category)).map((section, index) => (
                                <FAQSection key={index} section={section} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllFAQs;