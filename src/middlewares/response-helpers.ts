import type { Middleware, Response } from "polka";

type Data = Record<string, unknown> | string;
export type ResponseMethod = (data?: Data) => void;
type ResponseHelper = (res: Response) => ResponseMethod;

/** Ensures the given `data` is JSON and stringifies it, settings the response's `Content-Type` to `application/json`. */
const serialize = (res: Response, data: Data) => {
	if (typeof data === "string") {
		data = { message: data };
	}

	res.setHeader("Content-Type", "application/json");
	return JSON.stringify(data);
};

const ok: ResponseHelper = (res) => (data = {}) => {
	res.statusCode = 200;
	res.end(serialize(res, data));
};

const forbidden: ResponseHelper = (res) => (data = {}) => {
	res.statusCode = 403;
	res.end(serialize(res, data));
};

/** Creates JSON response helpers. Based on https://github.com/unix/koa-custom-response. */
export const responseHelpers: Middleware = (_req, res, next) => {
	res.ok = ok(res);
	res.forbidden = forbidden(res);

	void next();
};
