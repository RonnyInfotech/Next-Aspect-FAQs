import React, { useEffect, useState } from 'react';
import { InputText, Accordion, AccordionTab } from 'primereact';

const FAQSection = ({ section }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const headerTemplate = (title, index) => {
        const isSelected = index === activeIndex;
        const iconClassName = isSelected ? 'pi pi-minus' : 'pi pi-plus';

        return (
            <div style={{ marginLeft: 'auto', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>{title}</div>
                <div><i className={iconClassName}></i></div>
            </div>
        );
    };

    const onTabChange = (e) => {
        setActiveIndex(e.index);
    };

    useEffect(() => {
        setFilteredFaqs(section.questions);
    }, [section]);

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
            <div className='py-2 flex justify-content-between align-items-center'>
                <h3 className='font-bold'>{section.section}</h3>
                <span className='p-input-icon-left'>
                    <i className="pi pi-search" />
                    <InputText className='p-inputtext-sm w-full' type="search" value={searchQuery} onChange={handleSearch} placeholder="Search for questions..." />
                </span>
            </div>
            <Accordion activeIndex={activeIndex} onTabChange={onTabChange}>
                {filteredFaqs?.map((item, index) => (
                    <AccordionTab header={headerTemplate(item.question, index)} key={index}>
                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </AccordionTab>
                ))}
            </Accordion>
        </div>
    );
};

export default FAQSection;