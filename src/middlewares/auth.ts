import { Buffer } from "node:buffer";
import { parse } from "basic-auth";
import type { Middleware } from "polka";
import bearerToken from "polka-bearer-token";

const base64ToString = (input: string): string => Buffer.from(input, "base64").toString("utf8");

export const auth: Middleware = async (request, response, next) => {
	const { type: tokenType, value: token } = response.ctx.token;

	if (tokenType === "bearer") {
		const bearerMiddleware = bearerToken();
		await bearerMiddleware(request, response, () => {/* empty */});

		if (request.token !== token) {
			response.forbidden(`Invalid token - expected ${token}`);
		}
	} else {
		const authToken = base64ToString(token);
		const [username, password] = authToken.split(":", 2);

		const authentication = parse(request.headers.authorization ?? "");

		if (authentication?.name !== username || authentication?.pass !== password) {
			response.forbidden(`Invalid credentials - expected ${authToken}`);
		}
	}

	void next();
};
