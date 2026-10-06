import test from "ava";
import { stringToBase64 } from "uint8array-extras";
import { DEFAULT_ROUTE, verify } from "./_util.ts";

const basicAuthToken = stringToBase64("Open:Sesame");

test("bearer auth", verify, {
	request: {
		options: {
			headers: {
				authorization: "Bearer SecretToken",
			},
		},
		route: DEFAULT_ROUTE,
	},
	response: { name: "@mockscope/foobar" },
});

test("bearer auth - custom token", verify, {
	options: {
		token: {
			value: "CustomToken",
		},
	},
	request: {
		options: {
			headers: {
				authorization: "Bearer CustomToken",
			},
		},
		route: DEFAULT_ROUTE,
	},
	response: { name: "@mockscope/foobar" },
});

test("bearer auth - errors without a token", verify, {
	error: { message: "Invalid token - expected SecretToken", status: 403 },
	request: { route: DEFAULT_ROUTE },
});

test("basic auth", verify, {
	options: {
		token: {
			type: "basic",
			value: basicAuthToken,
		},
	},
	request: {
		options: {
			headers: {
				authorization: `Basic ${basicAuthToken}`,
			},
		},
		route: DEFAULT_ROUTE,
	},
	response: { name: "@mockscope/foobar" },
});

test("basic auth - errors without a token", verify, {
	error: { message: "Invalid credentials - expected Open:Sesame", status: 403 },
	options: {
		token: {
			type: "basic",
			value: basicAuthToken,
		},
	},
	request: { route: DEFAULT_ROUTE },
});
