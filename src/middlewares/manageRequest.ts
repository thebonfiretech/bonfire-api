import { Request, Response } from "express";

import { ResponseErrorsParams } from "@assets/config/errors";
import defaultConfig from "@assets/config/default";
import sendError from "@utils/functions/error";
import logger from "@utils/functions/logger";

interface ManageErrorParams {
    code: ResponseErrorsParams;
    error?: any;
}

export interface ManageRequestBody {
    defaultExpress: {
        res: Response;
        req: Request;
    };
    ids: {
        userID?: string;
    };
    manageError: (data: ManageErrorParams) => void;
    params: any;
    data: any;
}

interface ManageRequestParams {
    service: (manageRequestBody: ManageRequestBody) => Promise<any> | any;
}

const manageRequest = (service: ManageRequestParams["service"]) => {
    return async (req: Request, res: Response) => {
        let headersSent = false;

        const manageError = ({ code, error }: ManageErrorParams) => {
            if (headersSent) return;
            headersSent = true;
            sendError({ code, error, res, local: service.name });
        };

        try {
            const manageRequestBody: ManageRequestBody = {
                defaultExpress: { res, req },
                params: req.params,
                data: req.body,
                manageError,
                ids: {
                    userID: res.locals?.userID,
                },
            };

            const result = await service(manageRequestBody);

            if (headersSent) return;

            res.set("api-database-name", defaultConfig.clusterName);
            res.set("api-version", defaultConfig.version);
            res.set("api-mode", defaultConfig.mode);
            res.status(200).json(result);
            headersSent = true;
        } catch (error) {
            if (!headersSent) {
                logger.error("[manageRequest] Request internal error");
                console.error(error);
                sendError({ code: "internal_error", res });
                headersSent = true;
            }
        }
    };
};

export default manageRequest;
