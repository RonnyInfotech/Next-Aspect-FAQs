import { SPFI } from "@pnp/sp";
import { getSP } from "./pnpConfig";

// get single item from sharepoint list
export const getSPListItemById = async (listName, selectProperties, expandProperties, itemId) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.getById(itemId).select(...selectProperties).expand(...expandProperties)().then((res) => {
        return res;
    }).catch((err) => {
        console.log("Err..", err);
        return err;
    });
};

// get all item from sharepoint list
export const getSPListItems = async (listName, selectProperties, expandProperties, filterQuery, topCount, orderByColumn, orderBy) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.select(...selectProperties).expand(...expandProperties).filter(filterQuery).orderBy(orderByColumn, orderBy).top(topCount).getAll(5000).then((res: any) => {
        return res;
    }).catch((err: any) => {
        console.log("Err..", err);
        return err;
    });
};

// Insert item to sharepoint list
export const addItemToList = async (listName, item) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.add(item).then((res) => {
        return res;
    }).catch((err) => {
        console.log("Err..", err);
        return err;
    });
};

// Update item in sharepoint list
export const updateListItem = async (listName: string, item: any, itemId: any) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.getById(itemId).update(item).then((res: any) => {
        return res;
    }).catch((err) => {
        console.log("Err..", err);
        return err;
    });
};

// Delete Item from sharepoint list
export const deleteListItem = async (listName: string, itemId: number) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.getById(itemId).recycle().then((res: any) => {
        return res;
    }).catch((err) => {
        console.log("Err..", err);
        return err;
    });
};