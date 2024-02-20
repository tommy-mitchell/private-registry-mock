import test from "ava";
import { stringToBase64 } from "uint8array-extras";
import { route, verify } from "./_util.js";

const basicAuthToken = stringToBase64("Open:Sesame");

test("bearer auth", verify, {
	request: {
		route,
		options: {
			headers: {
				authorization: "Bearer SecretToken",
			},
		},
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
		route,
		options: {
			headers: {
				authorization: "Bearer CustomToken",
			},
		},
	},
	response: { name: "@mockscope/foobar" },
});

test("bearer auth - errors without a token", verify, {
	request: { route },
	error: { status: 403, message: "Invalid token - expected SecretToken" },
});

test("basic auth", verify, {
	options: {
		token: {
			type: "basic",
			value: basicAuthToken,
		},
	},
	request: {
		route,
		options: {
			headers: {
				authorization: `Basic ${basicAuthToken}`,
			},
		},
	},
	response: { name: "@mockscope/foobar" },
});

test("basic auth - errors without a token", verify, {
	options: {
		token: {
			type: "basic",
			value: basicAuthToken,
		},
	},
	request: { route },
	error: { status: 403, message: "Invalid credentials - expected Open:Sesame" },
});
