export const LISTS = {
    LICENSE_TABLE: { NAME: 'NATLicense' },
    FAQS_TABLE: { NAME: 'NATFAQs' },
    CATEGORIES_TABLE: { NAME: 'FAQCategories' },
    ADMIN_GROUP: { NAME: 'FAQs Admin' },
};

export const TOTAL_LISTS = [
    "FAQs Admin",
    "FAQCategories",
    "NATFAQs",
    "NATLicense",
];

export class GET_LIST_QUERY_PARAMS {
    public selectProperties: any = ["*"];
    public expandProperties: any = [""];
    public filterQuery: string = ``;
    public topCount: number = 5000;
    public orderByColumn: string = `ID`;
    public orderBy: boolean = true;
};

export const IsListHidden = false;
export const SECRET_KEY = "!@Next&Expect#Products*2023";
export const PRODUCT_NAME = "Next Aspect FAQs";
export const VERSION_KEY = 'Next Aspect FAQs 1.0.0.0';

// Sharepoint Lists Fields
export const FAQS_FIELDS = [
    'Content',
    'Active',
    'Category',
];