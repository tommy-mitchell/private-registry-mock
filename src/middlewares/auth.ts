import type { Middleware } from "polka";
import { base64ToString } from "uint8array-extras";
import bearerToken from "express-bearer-token";
import basicAuth from "basic-auth";

export const auth: Middleware = async (req, res, next) => {
	const { type: tokenType, value: token } = res.ctx.token;

	if (tokenType === "bearer") {
		const bearerMiddleware = bearerToken();
		await bearerMiddleware(req, res, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function

		if (req.token !== token) {
			res.forbidden(`Invalid token - expected ${token}`);
		}
	} else {
		const authToken = base64ToString(token);
		const [username, password] = authToken.split(":");

		const authentication = basicAuth(req);

		if (authentication?.name !== username || authentication?.pass !== password) {
			res.forbidden(`Invalid credentials - expected ${authToken}`);
		}
	}

	void next();
};
