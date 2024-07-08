import React, { useContext, useState } from 'react';
import { ListBox } from 'primereact';
import { FAQsContext } from '../../context/FAQsContext';
import FAQSection from './FAQSection';
import './AllFAQ.css';

const AllFAQs = () => {
    const { FAQsItems, categories } = useContext(FAQsContext);
    const [selectedCities, setSelectedCities] = useState(['General']);

    const faqData = [
        {
            category: "General",
            section: "General Questions",
            questions: [
                { question: "What is Frank AI?", answer: "Frank AI is an autonomous artificial intelligence assistant tool that focuses on helping Human Recruitment, qualify candidates or applicants, and manage the company." },
                { question: "How does Frank AI work?", answer: "Frank AI works by utilizing advanced algorithms to analyze and process data..." },
                { question: "Is Frank right for my company’s HR?", answer: "Frank AI is suitable for companies looking to streamline their HR processes..." },
                { question: "What are the costs and fees to use Frank AI?", answer: "The cost of using Frank AI depends on the subscription plan..." },
                { question: "How can I set up my account for Frank AI?", answer: "Setting up your account for Frank AI is simple. Just follow these steps..." },
                { question: "How can I set up my account for Frank AI?", answer: "Setting up your account for Frank AI is simple. Just follow these steps..." },
                { question: "How can I set up my account for Frank AI?", answer: "Setting up your account for Frank AI is simple. Just follow these steps..." },
            ]
        },
        // Additional sections can be added here
        {
            category: "Build",
            section: "Build Questions",
            questions: [
                { question: "How do I start a new project?", answer: "To start a new project, you need to..." },
                { question: "What tools are required?", answer: "The required tools are..." },
                // more questions
            ]
        },
        // Add more categories and sections as needed
    ];

    const subcategories = [
        { name: 'General', code: 'NY' },
        { name: 'Build', code: 'RM' },
        { name: 'Promote', code: 'LDN' },
        { name: 'Manage', code: 'IST' },
        { name: 'Integrations', code: 'PRS' },
        { name: 'Legal', code: 'PRS' },
    ];

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
                                value={selectedCities}
                                onChange={(e) => setSelectedCities(e.value)}
                                options={subcategories}
                                optionLabel="name"
                                optionValue='name'
                                className="w-full md:w-14rem"
                            />
                        </div>
                    </div>
                    <div className='col-12 md:col-9 lg:col-9 faq-content'>
                        <div style={{ maxHeight: '52vh', overflow: 'auto', width: '95%' }}>
                            {faqData.filter(section => selectedCities?.includes(section.category)).map((section, index) => (
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