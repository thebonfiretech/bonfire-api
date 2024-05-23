import { sendError } from '../app.js';

const handleRequest = async (req, res, serviceMethod) => {
	try {
		const requestData = { ...req.body };
		console.log(serviceMethod)
		const requestUserId = req.user;
		const response = await serviceMethod(requestData, requestUserId);

		if (response?.error) {
			return sendError(res, response.error);
		}

		return res.status(200).json(response);
	} catch (error) {
		console.log(error)
		return sendError(res, 'internal_error');
	}
};

export default handleRequest;