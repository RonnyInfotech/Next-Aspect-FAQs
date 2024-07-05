import { SPFI } from "@pnp/sp";
import CryptoJS from 'crypto-js';
import { format } from "date-fns";
import { addDoc, collection } from "firebase/firestore";
import { getSP } from "../../services/pnpConfig";
import { IsListHidden, LISTS, SECRET_KEY, VERSION_KEY } from "../../common/constants";
import { db } from "../../services/firebase";
import { absoluteUrl, currentUserEmail, currentUserName, tenantId } from "../../webparts/nextAspectFaqs/components/NextAspectFaqs";

export const licenseList = async () => {
    try {
        const sp: SPFI = getSP();
        const listEnsureResult = await sp.web.lists.ensure(LISTS.LICENSE_TABLE.NAME, `${VERSION_KEY} : ${LISTS.LICENSE_TABLE.NAME}`, 100, false, { Hidden: IsListHidden });
        if (listEnsureResult.created) {
            await addEntryInLicenseList();
            console.log(`${LISTS.LICENSE_TABLE.NAME} list created`);
            return listEnsureResult;
        }
    } catch (error) {
        console.log("Error in License List", error);
    }
};

export const addEntryInLicenseList = async () => {
    try {
        const sp: SPFI = getSP();

        await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).fields.select("*")().then(async (res) => {
            let licenseFieldsArray: any = [];
            res.forEach((ele) => {
                licenseFieldsArray.push(ele.InternalName);
            });

            if (!licenseFieldsArray.includes("licenseKey")) {
                await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).fields.addMultilineText("licenseKey", { NumberOfLines: 6, RichText: false });
                await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).defaultView.fields.add("licenseKey");
            }

            await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).fields.select("*")().then(async (resListData) => {
                let listColumnData: any = [];
                resListData.forEach((ele) => {
                    listColumnData.push(ele.InternalName);
                });
                if (!listColumnData.includes("licenseKey")) {
                    await addEntryInLicenseList();
                }
                else {
                    const addDays = (days) => {
                        var date = new Date();
                        date.setDate(date.getDate() + days);
                        return date;
                    };

                    const insertData = {
                        clientURL: window.location.hostname,
                        tenantId: tenantId,
                        licenseType: 'Next Aspect FAQs - Trial',
                        productName: 'Next Aspect FAQs',
                        installationDate: format(new Date(), 'yyyy-MM-dd'),
                        expireDate: format(addDays(5), 'yyyy-MM-dd'),
                        status: 'Active'
                    };

                    // const secret = generateFormattedKeyFromPassphrase(SECRET_KEY);
                    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(insertData), SECRET_KEY).toString();
                    await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).items.add({
                        licenseKey: encryptedData,
                    });

                    try {
                        await addDoc(collection(db, 'NextAspectFAQs'), {
                            Title: currentUserName,
                            Email: currentUserEmail,
                            TenantId: tenantId,
                            Company: "",
                            ContactNumber: "",
                            Country: "",
                            OfferSource: "Next Aspect FAQs",
                            LeadSource: 999,
                            Requirements: "Install Next Aspect FAQs on site: " + absoluteUrl + " and TenantId: " + tenantId + " and date: " + format(new Date(), 'yyyy-MM-dd HH:mm') + "."
                        })
                    } catch (error) {
                        console.log("error>>>>>>>>>>", error);
                    }
                }
            })
        }).catch((err) => {
            console.log("Error in License Fields creation", err);
        })
    }
    catch (ex) {
        console.log("Error in License Fields list", ex);
    }
};