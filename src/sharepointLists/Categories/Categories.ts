import { SPFI } from "@pnp/sp";
import { getSP } from "../../services/pnpConfig";
import { CATEGORIES_FIELDS, FAQS_FIELDS, IsListHidden, LISTS, VERSION_KEY } from "../../common/constants";
import { addItemToList } from "../../services/SPService";

export const categoryList = async () => {
    try {
        const sp: SPFI = getSP();
        const listEnsureResult = await sp.web.lists.ensure(LISTS.CATEGORIES_TABLE.NAME, `${VERSION_KEY} : ${LISTS.CATEGORIES_TABLE.NAME}`, 100, false, { Hidden: IsListHidden });
        if (listEnsureResult.created) {
            console.log(`${LISTS.CATEGORIES_TABLE.NAME} list created`);
            await categoryFields(LISTS.CATEGORIES_TABLE.NAME);
            return listEnsureResult;
        }
    } catch (error) {
        console.log("Error in Categories List", error);
    }
};

const categoryFields = async (listName) => {
    try {
        const sp: SPFI = getSP();
        await sp.web.lists.getByTitle(listName).fields.select("*")().then(async (res) => {
            const categoryFieldsArray: any = [];

            for (let i = 0; i < res.length; i++) {
                categoryFieldsArray.push(res[i].InternalName)
            }

            if (!categoryFieldsArray.includes("Active")) {
                await sp.web.lists.getByTitle(listName).fields.addBoolean("Active");
                await sp.web.lists.getByTitle(listName).defaultView.fields.add("Active");
            }

            if (!categoryFieldsArray.includes("Sequence")) {
                await sp.web.lists.getByTitle(listName).fields.addNumber("Sequence");
                await sp.web.lists.getByTitle(listName).defaultView.fields.add("Sequence");
            }

            await sp.web.lists.getByTitle(LISTS.CATEGORIES_TABLE.NAME).fields.select("*")().then(async (resListData) => {
                let listColumnData = [];
                for (let ele of resListData) {
                    listColumnData.push(ele.InternalName);
                }
                for (let ele of CATEGORIES_FIELDS) {
                    if (listColumnData.indexOf(ele) == -1) {
                        await categoryFields(LISTS.CATEGORIES_TABLE.NAME);
                        break;
                    }
                }
                await addDefaultCategories();
            }).catch((err) => {
                console.log("Error in Categories fields creation", err);
            });
        }).catch((err) => { console.log("Error in Categories fields creation", err); });
    }
    catch (ex) {
        console.log("Error in get Categories fields fields", ex);
    }
};

const addDefaultCategories = async () => {
    const defaultCategories = [
        {
            Title: 'Categories 1',
            Sequence: 1,
            Active: true,
        },
        {
            Title: 'Categories 2',
            Sequence: 2,
            Active: true,
        },
        {
            Title: 'Categories 3',
            Sequence: 3,
            Active: true,
        },
        {
            Title: 'Categories 4',
            Sequence: 4,
            Active: true,
        },
        {
            Title: 'Categories 5',
            Sequence: 5,
            Active: true,
        }
    ];

    defaultCategories.map(async ele => {
        await addItemToList(LISTS.CATEGORIES_TABLE.NAME, ele).then(() => {
            console.log("Categories added successfully");
        }).catch((err) => {
            console.log("Error in adding categories", err);
        });
    });
};