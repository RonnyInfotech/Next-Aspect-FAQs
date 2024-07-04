import { licenseList } from "./License/License";
import { faqsList } from "./FAQs/NATFAQs";
import { adminGroup } from "./AdminGroup/AdminGroup";

export const createLists = async () => {
    try {
        // Call createImpDataList
        await licenseList();
        await faqsList();
        await adminGroup();
    } catch (error) {
        console.log("Error in create lists...", error);
    }
};