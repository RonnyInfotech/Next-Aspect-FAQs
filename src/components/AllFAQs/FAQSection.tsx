import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact';

const FAQSection = ({ section }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFaqs, setFilteredFaqs] = useState([]);

    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        setFilteredFaqs(section.questions);
    }, [section]);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const FAQItem = ({ item, isOpen, onToggle }) => {
        return (
            <div className="faq-item">
                <div className="faq-question" onClick={onToggle}>
                    <h3 className='font-medium'>{item.question}</h3>
                    <div className="mr-3">
                        {isOpen ? <i className="pi pi-minus-circle" /> : <i className="pi pi-plus-circle" />}
                    </div>
                </div>
                {isOpen && <div className="faq-answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
            </div>
        );
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchQuery(term);
        const filtered = section.questions.filter(question =>
            question.question.toLowerCase().includes(term)
        );
        setFilteredFaqs(filtered);
    };

    return (
        <div className="faq-section">
            <div className='py-2 pr-2 flex justify-content-between align-items-center'>
                <h3 className='font-bold'>{section.section}</h3>
                <span className='p-input-icon-left'>
                    <i className="pi pi-search" />
                    <InputText className='p-inputtext-sm w-full' type="search" value={searchQuery} onChange={handleSearch} placeholder="Search for questions..." />
                </span>
            </div>
            {filteredFaqs?.map((item, index) => (
                <FAQItem
                    key={index}
                    item={item}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    );
};

export default FAQSection;