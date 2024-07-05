import { SPFI } from "@pnp/sp";
import { getSP } from "../../services/pnpConfig";
import { LISTS } from "../../common/constants";
import { currentUserEmail } from "../../webparts/nextAspectFaqs/components/NextAspectFaqs";

export const adminGroup = async () => {
    const sp: SPFI = getSP();
    const groups = await sp.web.siteGroups();
    const checkGroupExists = groups.filter(({ LoginName }) => LoginName === LISTS.ADMIN_GROUP.NAME);

    if (checkGroupExists.length === 0) {
        try {
            await sp.web.siteGroups.add({ "Title": LISTS.ADMIN_GROUP.NAME }).then(async (res: any) => {
                if (res?.data?.LoginName) {
                    await sp.web.siteGroups.getByName(res?.data?.LoginName).users.add("i:0#.f|membership|" + currentUserEmail + "");
                }
            });
        } catch (error) {
            console.log("Error in Create Admin Group", error);
        }
    }
};