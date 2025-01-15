import { ManageRequestBody } from "@middlewares/manageRequest";
import { TicketModelType } from "@utils/types/models/ticket";
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

            let { title, description, type, scope, attachments, displayName }: Partial<TicketModelType> = data;
            if (!title || !description || !type || !scope) return manageError({ code: "invalid_data" });

            description = stringService.filterBadwords(description);
            title = stringService.filterBadwords(title);

            const newTicket = new ticketModel({
                createAt: Date.now(),
                displayName,
                attachments,
                description,
                scope,
                userID,
                title,
                type,
            }); 

            return await newTicket.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUserTickets: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            return await ticketModel.find({ userID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getTicket: async ({ manageError, ids, params }: ManageRequestBody) => {
        try {
            const { ticketID } =  params;

            const { userID } = ids;
            if (!userID || !ticketID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const ticket = await ticketModel.findById(ticketID);
            if (!ticket) return manageError({ code: "ticket_not_found" });

            return ticket;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default ticketResource;