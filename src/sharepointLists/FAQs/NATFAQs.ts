import { SPFI } from "@pnp/sp";
import { getSP } from "../../services/pnpConfig";
import { FAQS_FIELDS, IsListHidden, LISTS, VERSION_KEY } from "../../common/constants";
import { addItemToList } from "../../services/SPService";

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
                await addDefaultQuestion();
            }).catch((err) => {
                console.log("Error in FAQs fields creation", err);
            });
        }).catch((err) => { console.log("Error in FAQs fields creation", err); });
    }
    catch (ex) {
        console.log("Error in get FAQs fields fields", ex);
    }
};

const addDefaultQuestion = async () => {
    try {
        const sp: SPFI = getSP();
        const categoryItemsDemo = await sp.web.lists.getByTitle(LISTS.CATEGORIES_TABLE.NAME).items.select("*").orderBy('Sequence')();
        console.log("categoryItemsDemo>>>", categoryItemsDemo);
        const categoryItems = await sp.web.lists.getByTitle(LISTS.CATEGORIES_TABLE.NAME).items.select("*").orderBy('Sequence').getAll(5000);
        // Sort categories by Sequence property
        const sortedCategories = categoryItems.sort((a, b) => a.Sequence - b.Sequence);

        const loremIpsumContents = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper.",
            "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
            "Nullam tincidunt justo nec nisi ultricies, at semper arcu consequat.",
            "Sed vitae lectus sit amet odio ultricies luctus vitae at risus.",
            "Fusce consequat tellus non ex molestie, vel volutpat purus varius.",
            "Vestibulum auctor leo at nisi vehicula, eget tincidunt velit efficitur.",
            "Cras vestibulum nisl eget nunc molestie, eget efficitur magna consectetur.",
            "Suspendisse efficitur leo ac velit ultrices, sit amet tempor mi vestibulum.",
            "Donec ac mauris eget nunc sollicitudin lacinia.",
            "Integer eget magna nec nunc dictum feugiat.",
            "Quisque molestie libero sit amet est bibendum, in consequat velit suscipit.",
            "Ut varius tortor sit amet justo ultricies, a sagittis orci rutrum.",
            "Mauris ac ipsum sit amet sapien convallis ultrices.",
            "Aliquam malesuada lorem in tellus malesuada, vel dignissim purus dignissim.",
            "Nam eget felis sed est ultricies dictum.",
            "Fusce mollis enim vel urna tempus lobortis.",
            "Phasellus dignissim velit vel risus feugiat, sit amet tincidunt enim lacinia.",
            "Etiam sagittis quam a tortor ullamcorper, vitae tristique felis posuere.",
            "Praesent scelerisque lorem non neque pharetra, vel interdum odio pulvinar.",
            "In hac habitasse platea dictumst. Curabitur condimentum.",
        ];

        const getRandomElements = (array, numberOfElements) => {
            const shuffled = array?.sort(() => 0.5 - Math.random());
            return shuffled?.slice(0, numberOfElements);
        };

        const generateFAQsForCategory = (category, numberOfFAQs) => {
            const faqs = [];
            const selectedContents = getRandomElements(loremIpsumContents, numberOfFAQs);

            for (let i = 0; i < numberOfFAQs; i++) {
                const titleSnippet = selectedContents[i]?.split(' ')?.slice(0, 3)?.join(' ');
                faqs.push({
                    Title: titleSnippet,
                    Content: selectedContents[i],
                    CategoryId: category.ID,
                    Active: true,
                });
            }
            return faqs;
        };

        // Generate FAQs for each category
        const defaultFAQsItems = sortedCategories.reduce((acc, category) => {
            const categoryFaqs = generateFAQsForCategory(category, 5);
            acc.push(...categoryFaqs);
            return acc;
        }, []);

        console.log(defaultFAQsItems);

        defaultFAQsItems.map(async ele => {
            await addItemToList(LISTS.FAQS_TABLE.NAME, ele).then(() => {
                console.log("FAQs added successfully");
            }).catch((err) => {
                console.log("Error in adding FAQs", err);
            });
        });
    } catch (error) {
        console.log(error);
    };
};