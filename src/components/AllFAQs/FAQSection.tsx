import React, { useState } from 'react';

const FAQSection = ({ section }) => {
    const [openIndex, setOpenIndex] = useState(null);

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
                {isOpen && <div className="faq-answer">{item.answer}</div>}
            </div>
        );
    };

    return (
        <div className="faq-section">
            <h3 className='font-bold'>{section.section}</h3>
            {section.questions.map((item, index) => (
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