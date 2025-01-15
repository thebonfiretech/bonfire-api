interface ResponseError {
  statusCode: 100 | 101 | 102 | 200 | 201 | 202 | 204 | 301 | 302 | 304 | 400 | 401 | 403 | 404 | 409 | 429 | 500 | 501 | 502 | 503;
  message: string;
};
export type ResponseErrorsParams = 
  | "system_role_modification_forbidden"
  | "content_contains_badwords"
  | "user_already_registered"
  | "no_execution_permission"
  | "user_already_in_space"
  | "space_already_exists" 
  | "admin_access_denied"
  | "no_credentials_send" 
  | "user_already_exists" 
  | "role_already_exists" 
  | "invalid_credentials" 
  | "user_not_registered"
  | "key_already_exists" 
  | "no_slots_available"
  | "token_is_not_valid"
  | "user_not_in_space"
  | "ticket_not_found" 
  | "space_not_found" 
  | "internal_error" 
  | "invalid_params" 
  | "user_not_found" 
  | "role_not_found" 
  | "key_not_found" 
  | "access_denied"
  | "invalid_data" 
  | "no_data_send" 
  | "no_token"

export const ResponseErrors: Record<ResponseErrorsParams, ResponseError> = {
  system_role_modification_forbidden: {
    message: "Not allowed to modify or delete system-created roles",
    statusCode: 403,
  },
  no_execution_permission: {
    message: "Permission denied for execution",
    statusCode: 403,
  },
  internal_error: {
    message: "Server Error",
    statusCode: 500,
  },
  no_credentials_send: {
    message: "No credentials send",
    statusCode: 401,
  },
  no_data_send: {
    message: "No data send",
    statusCode: 400,
  },
  invalid_credentials: {
    message: "Invalid Credentials",
    statusCode: 401,
  },
  no_token: {
    message: "No token, authorization denied",
    statusCode: 400,
  },
  token_is_not_valid: {
    message: "Token is not valid",
    statusCode: 401,
  },
  user_not_found: {
    message: "User not found",
    statusCode: 404,
  },
  ticket_not_found: {
    message: "Ticket not found",
    statusCode: 404,
  },
  key_not_found: {
    message: "Key not found",
    statusCode: 404,
  },
  role_not_found: {
    message: "Role not found",
    statusCode: 404,
  },
  space_not_found: {
    message: "Space not found",
    statusCode: 404,
  },
  user_already_exists: {
    message: "User already exists",
    statusCode: 409,
  },
  role_already_exists: {
    message: "Role already exists",
    statusCode: 409,
  },
  user_already_registered: {
    message: "User already registered",
    statusCode: 409,
  },
  space_already_exists: {
    message: "Space already exists",
    statusCode: 409,
  },
  key_already_exists: {
    message: "Key already exists",
    statusCode: 409,
  },
  access_denied: {
    message: "Access Denied",
    statusCode: 401,
  },
  admin_access_denied: {
    message: "No admin, Access Denied",
    statusCode: 401,
  },
  invalid_params: {
    message: "Invalid params send",
    statusCode: 400,
  },
  invalid_data: {
    message: "Invalid data send",
    statusCode: 400,
  },
  user_not_registered: {
    message: "User not registered",
    statusCode: 404,
  },
  no_slots_available: { 
    message: "No slots available",
    statusCode: 409,
  },
  content_contains_badwords: {
    message: "Content contains prohibited words",
    statusCode: 400,
  },
  user_already_in_space: {
    message: "User is already in the space",
    statusCode: 409,
  },
  user_not_in_space: {
    message: "User is not in the space",
    statusCode: 404,
  },
};
