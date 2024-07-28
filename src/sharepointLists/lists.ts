import { licenseList } from "./License/License";
import { faqsList } from "./FAQs/NATFAQs";
import { adminGroup } from "./AdminGroup/AdminGroup";
import { categoryList } from "./Categories/Categories";

export const createLists = async () => {
    try {
        // Call createImpDataList
        await licenseList();
        await categoryList();
        await faqsList();
        await adminGroup();
    } catch (error) {
        console.log("Error in create lists...", error);
    }
};