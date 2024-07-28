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
            setSelectedCategory(categories[0]?.Title)
        }
    }, [categories]);

    const FAQData = generateFaqData(categories, FAQsItems);

    const categoryTemplate = (option) => {
        return (
            <div className={`list-item flex align-items-center ${selectedCategory === option?.Title && 'selected'}`}>
                <i className="pi pi-list" style={{ marginRight: '.5rem' }} />
                <div>{option.Title}</div>
            </div>
        );
    };

    return (
        <>
            <h1 className='font-medium' style={{ fontSize: '1.8rem' }}>Frequently Asked Questions</h1>
            <div className='grid'>
                <div className='col-12 md:col-3 lg:col-3 flex justify-content-center'>
                    <div>
                        <div className='flex align-items-baseline'>
                            <i className='mr-2 pi pi-th-large' />
                            <h3 className='mt-3 ml-1 font-bold' style={{ marginBottom: '0.8rem' }}>FAQ Categories</h3>
                        </div>
                        <ListBox
                            listClassName="custom-listbox"
                            listStyle={{ maxHeight: '250px' }}
                            // multiple
                            filter
                            itemTemplate={categoryTemplate}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.value)}
                            options={categories?.filter(category => category.Active)}
                            optionLabel="Title"
                            optionValue='Title'
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>
                <div className='col-12 md:col-9 lg:col-9'>
                    {FAQData?.filter(section => selectedCategory?.includes(section.category)).map((section, index) => (
                        <FAQSection key={index} section={section} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default AllFAQs;