export const LISTS = {
    LICENSE_TABLE: { NAME: 'FAQsLicense' },
    FAQS_TABLE: { NAME: 'FAQQuestions' },
    CATEGORIES_TABLE: { NAME: 'FAQCategories' },
    ADMIN_GROUP: { NAME: 'FAQs Admin' },
};

export const TOTAL_LISTS = [
    "FAQs Admin",
    "FAQCategories",
    "FAQQuestions",
    "FAQsLicense",
];

export class GET_LIST_QUERY_PARAMS {
    public selectProperties: any = ["*"];
    public expandProperties: any = [""];
    public filterQuery: string = ``;
    public topCount: number = 5000;
    public orderByColumn: string = `ID`;
    public orderBy: boolean = true;
};

export const IsListHidden = true;
export const SECRET_KEY = "!@Next&Expect#Products*2023";
export const PRODUCT_NAME = "Next Aspect FAQs";
export const VERSION_KEY = 'Next Aspect FAQs 1.0.0.0';

// Sharepoint Lists Fields
export const FAQS_FIELDS = [
    'Content',
    'Active',
    'Category',
];

export const CATEGORIES_FIELDS = [
    'Active',
    'Sequence'
];