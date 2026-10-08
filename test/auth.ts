import test from "ava";
import { DEFAULT_ROUTE, verify } from "./_util.ts";

const basicAuthToken = new TextEncoder().encode("Open:Sesame").toBase64();

test("bearer auth", verify, {
	requests: [{
		options: {
			headers: {
				authorization: "Bearer SecretToken",
			},
		},
		route: DEFAULT_ROUTE,
	}],
	responses: [{ name: "@mockscope/foobar" }],
});

test("bearer auth - custom token", verify, {
	options: {
		token: {
			value: "CustomToken",
		},
	},
	requests: [{
		options: {
			headers: {
				authorization: "Bearer CustomToken",
			},
		},
		route: DEFAULT_ROUTE,
	}],
	responses: [{ name: "@mockscope/foobar" }],
});

test("bearer auth - errors without a token", verify, {
	requests: [{ route: DEFAULT_ROUTE }],
	responses: [{ message: "Invalid token - expected SecretToken", status: 403 }],
});

test("basic auth", verify, {
	options: {
		token: {
			type: "basic",
			value: basicAuthToken,
		},
	},
	requests: [{
		options: {
			headers: {
				authorization: `Basic ${basicAuthToken}`,
			},
		},
		route: DEFAULT_ROUTE,
	}],
	responses: [{ name: "@mockscope/foobar" }],
});

test("basic auth - errors without a token", verify, {
	options: {
		token: {
			type: "basic",
			value: basicAuthToken,
		},
	},
	requests: [{ route: DEFAULT_ROUTE }],
	responses: [{ message: "Invalid credentials - expected Open:Sesame", status: 403 }],
});
