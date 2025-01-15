import { Router } from "express";

import ticketsResource from "@resources/ticket/ticket.resource";
import manageRequest from "@middlewares/manageRequest";

const ticketsRouter = Router();

ticketsRouter.patch("/:ticketID/messages/add", manageRequest(ticketsResource.createTicket));
ticketsRouter.get("/space/:spaceID", manageRequest(ticketsResource.getSpaceTickets));
ticketsRouter.get("/system", manageRequest(ticketsResource.getSystemTickets));
ticketsRouter.post("/create", manageRequest(ticketsResource.createTicket));
ticketsRouter.get("/:ticketID", manageRequest(ticketsResource.getTicket));
ticketsRouter.get("/user", manageRequest(ticketsResource.getUserTickets));


export default ticketsRouter;