interface ResponseError {
    statusCode: 100 | 101 | 102 | 200 | 201 | 202 | 204 | 301 | 302 | 304 | 400 | 401 | 403 | 404 | 500 | 501 | 502 | 503;
    message: string;
};

export type ResponseErrorsParams = "internal_error";

export const ResponseErrors: Record<ResponseErrorsParams, ResponseError> = {
    internal_error: {
        message: "Server Error",
        statusCode: 500
    }
};