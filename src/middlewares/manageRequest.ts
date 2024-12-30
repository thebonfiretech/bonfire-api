import { Request, Response } from "express";

import { ResponseErrorsParams } from "@assets/config/errors";
import defaultConfig from "@assets/config/default";
import sendError from "@utils/functions/error";
import packageJson from "../../package.json";
import logger from "@utils/functions/logger";

interface ManageErrorParams {
    code:  ResponseErrorsParams;
    error?: any;
};

export interface ManageRequestBody {
    defaultExpress: {
        res: Response;
        req: Request;
    };
    ids: {
        userID?: string;
    },
    manageError: (data: ManageErrorParams) => void;
    params: any;
    data: any;
};

interface ManageRequestParams {
    service: (manageRequestBody: ManageRequestBody) => Promise<any> | any; 
};

const manageRequest = (service: ManageRequestParams["service"]) => {
    return async (req: Request, res: Response) => {
        try {
            const manageError = ({ code, error}: ManageErrorParams) => {
                return sendError({ code, error, res, local: service.name });
            };
            
            const manageRequestBody: ManageRequestBody = {
                defaultExpress: { res, req },
                params: req.params,
                data: req.body,
                manageError,
                ids: {
                    userID: res.locals?.userID
                },
            };
            const result = await service(manageRequestBody);
            
            if (result === "error") return;

            res.set("api-database-name", defaultConfig.clusterName);
            res.set("api-version", packageJson.version);
            res.set("api-mode", defaultConfig.mode);
            res.status(200).json(result);
        } catch (error) {
            logger.error("[manageRequest] Request internal error");
            console.log(error);
            sendError({ code: "internal_error", res });
            return;
        }
    };
};

export default manageRequest;
