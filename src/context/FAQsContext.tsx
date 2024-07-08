import React, { createContext, useEffect, useState } from 'react';
import { GET_LIST_QUERY_PARAMS, LISTS } from '../common/constants';
import { getSPListItems } from '../services/SPService';
import { getSP } from '../services/pnpConfig';
import { SPFI } from '@pnp/sp';

export const FAQsContext = createContext(null);

const FAQsContextProvider = (props: any) => {
    const [admin, setAdmin] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    const [FAQsItems, setFAQsItems] = useState([]);
    const [categories, setCategories] = useState([]);

    const checkUserIsAdmin = async () => {
        const sp: SPFI = getSP();
        let groups = await sp.web.currentUser.groups();
        let filterAdminUserGroup = groups.filter(({ LoginName }) => LoginName === LISTS.ADMIN_GROUP.NAME);
        filterAdminUserGroup.length > 0 ? setAdmin(true) : setAdmin(false);
    };

    const getCategoriesData = async () => {
        const queryParams = new GET_LIST_QUERY_PARAMS();
        const _categories = await getSPListItems(
            LISTS.CATEGORIES_TABLE.NAME,
            queryParams.selectProperties,
            queryParams.expandProperties,
            queryParams.filterQuery,
            queryParams.topCount,
            queryParams.orderByColumn,
            queryParams.orderBy
        );
        setCategories(_categories?.length > 0 ? _categories : []);
    };

    const getFAQSData = async () => {
        const queryParams = new GET_LIST_QUERY_PARAMS();
        queryParams.selectProperties = ["*,Category/ID,Category/Title"];
        queryParams.expandProperties = ["Category"];
        const _faqs = await getSPListItems(
            LISTS.FAQS_TABLE.NAME,
            queryParams.selectProperties,
            queryParams.expandProperties,
            queryParams.filterQuery,
            queryParams.topCount,
            queryParams.orderByColumn,
            queryParams.orderBy
        );
        setFAQsItems(_faqs?.length > 0 ? _faqs : []);
    };

    useEffect(() => {
        checkUserIsAdmin();
        getCategoriesData();
        getFAQSData();
        if (window.screen.width <= 425) {
            setIsMobile(false);
        } else {
            setIsMobile(true);
        }
    }, []);

    return (
        <FAQsContext.Provider
            value={{
                admin,
                setAdmin,
                isMobile,
                setIsMobile,
                FAQsItems,
                setFAQsItems,
                categories,
                setCategories,
                getCategoriesData
            }}
        >
            {props.children}
        </FAQsContext.Provider>
    );
};

export default FAQsContextProvider;