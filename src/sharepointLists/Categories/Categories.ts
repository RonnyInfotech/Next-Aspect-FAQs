import { SPFI } from "@pnp/sp";
import { getSP } from "../../services/pnpConfig";
import { IsListHidden, LISTS, VERSION_KEY } from "../../common/constants";

export const categoryList = async () => {
    try {
        const sp: SPFI = getSP();
        const listEnsureResult = await sp.web.lists.ensure(LISTS.CATEGORIES_TABLE.NAME, `${VERSION_KEY} : ${LISTS.CATEGORIES_TABLE.NAME}`, 100, false, { Hidden: IsListHidden });
        if (listEnsureResult.created) {
            console.log(`${LISTS.CATEGORIES_TABLE.NAME} list created`);
            return listEnsureResult;
        }
    } catch (error) {
        console.log("Error in Categories List", error);
    }
};