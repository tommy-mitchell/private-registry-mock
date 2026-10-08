import type { Middleware, Response } from "polka";

type Data = Record<string, unknown> | string;
export type ResponseMethod = (data?: Data) => void;
type ResponseHelper = (response: Response) => ResponseMethod;

/** Ensures the given `data` is JSON and stringifies it, settings the response's `Content-Type` to `application/json`. */
const serialize = (response: Response, data: Data) => {
	if (typeof data === "string") {
		data = { message: data };
	}

	response.setHeader("Content-Type", "application/json");
	return JSON.stringify(data);
};

const ok: ResponseHelper = (response) => (data = {}) => {
	response.statusCode = 200;
	response.end(serialize(response, data));
};

const notFound: ResponseHelper = (response) => (data = {}) => {
	response.statusCode = 404;
	response.end(serialize(response, data));
};

const forbidden: ResponseHelper = (response) => (data = {}) => {
	response.statusCode = 403;
	response.end(serialize(response, data));
};

/** Creates JSON response helpers. Based on https://github.com/unix/koa-custom-response. */
export const responseHelpers: Middleware = (_request, response, next) => {
	response.ok = ok(response);
	response.notFound = notFound(response);
	response.forbidden = forbidden(response);

	void next();
};
