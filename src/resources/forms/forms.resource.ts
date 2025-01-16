import { TicketModelType } from "@utils/types/models/ticket";
import { ManageRequestBody } from "@middlewares/manageRequest";
import { hasRolePermission } from "@database/functions/space";
import stringService from "@utils/services/stringServices";
import { hasUser } from "@database/functions/user";
import ticketModel from "@database/model/ticket";

const ticketResource = {
    createTicket: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (user.role != "admin") return manageError({ code: "admin_access_denied" });

            let { title, description, type, scope, attachments, displayName, spaceID }: Partial<TicketModelType> = data;
            if (!title || !description || !type || !scope) return manageError({ code: "invalid_data" });

            const newForm = new ticketModel({
                createAt: Date.now(),
                displayName,
                attachments,
                description,
                spaceID,
                userID,
                scope,
                title,
                type,
            }); 

            return await newForm.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default ticketResource;