import { SPFI } from "@pnp/sp";
import { getSP } from "../../services/pnpConfig";
import { FAQS_FIELDS, IsListHidden, LISTS, VERSION_KEY } from "../../common/constants";

export const faqsList = async () => {
    try {
        const sp: SPFI = getSP();
        const listEnsureResult = await sp.web.lists.ensure(LISTS.FAQS_TABLE.NAME, `${VERSION_KEY} : ${LISTS.FAQS_TABLE.NAME}`, 100, false, { Hidden: IsListHidden });
        if (listEnsureResult.created) {
            await faqsFields(LISTS.FAQS_TABLE.NAME);
            console.log(`${LISTS.FAQS_TABLE.NAME} list created`);
            return listEnsureResult;
        }
    } catch (error) {
        console.log("Error in FAQs List", error);
    }
};

const faqsFields = async (listName) => {
    try {
        const sp: SPFI = getSP();
        const categoryList = await sp.web.lists.getByTitle(LISTS.CATEGORIES_TABLE.NAME)();
        await sp.web.lists.getByTitle(listName).fields.select("*")().then(async (res) => {
            const ticketFieldsArray: any = [];

            for (let i = 0; i < res.length; i++) {
                ticketFieldsArray.push(res[i].InternalName)
            }

            if (!ticketFieldsArray.includes("Content")) {
                await sp.web.lists.getByTitle(listName).fields.addMultilineText("Content", { RichText: false });
                await sp.web.lists.getByTitle(listName).defaultView.fields.add("Content");
            }

            if (!ticketFieldsArray.includes("Active")) {
                await sp.web.lists.getByTitle(listName).fields.addBoolean("Active");
                await sp.web.lists.getByTitle(listName).defaultView.fields.add("Active");
            }

            if (!ticketFieldsArray.includes("Category")) {
                await sp.web.lists.getByTitle(listName).fields.addLookup("Category", { LookupListId: categoryList?.Id, LookupFieldName: "Title" });
                await sp.web.lists.getByTitle(listName).defaultView.fields.add("Category");
            }

            await sp.web.lists.getByTitle(LISTS.FAQS_TABLE.NAME).fields.select("*")().then(async (resListData) => {
                let listColumnData = [];
                for (let ele of resListData) {
                    listColumnData.push(ele.InternalName);
                }
                for (let ele of FAQS_FIELDS) {
                    if (listColumnData.indexOf(ele) == -1) {
                        await faqsFields(LISTS.FAQS_TABLE.NAME);
                        break;
                    }
                }
            }).catch((err) => {
                console.log("Error in FAQs fields creation", err);
            });
        }).catch((err) => { console.log("Error in FAQs fields creation", err); });
    }
    catch (ex) {
        console.log("Error in get FAQs fields fields", ex);
    }
}