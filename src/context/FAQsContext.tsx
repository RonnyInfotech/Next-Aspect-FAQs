import React, { createContext, useState } from 'react';

export const FAQsContext = createContext(null);

const FAQsContextProvider = (props: any) => {
    const [admin, setAdmin] = useState(false);
    return (
        <FAQsContext.Provider
            value={{
                admin,
                setAdmin
            }}
        >
            {props.children}
        </FAQsContext.Provider>
    );
};

export default FAQsContextProvider;