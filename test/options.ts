import test from "ava";
import { DEFAULT_AUTH, DEFAULT_ROUTE, verify } from "./_util.ts";

test("port", verify, {
	options: { port: 63000 },
	request: { options: DEFAULT_AUTH, route: DEFAULT_ROUTE },
	response: { name: "@mockscope/foobar" },
});

test("hostname", verify, {
	options: { hostname: "127.0.0.1" },
	request: { options: DEFAULT_AUTH, route: DEFAULT_ROUTE },
	response: { name: "@mockscope/foobar" },
});

test("package name", verify, {
	options: { package: { name: "foobar" } },
	request: { options: DEFAULT_AUTH },
	response: {
		name: "foobar",
		versions: { "1.0.0": { name: "foobar" } },
	},
});

test("package version", verify, {
	options: { package: { version: "2.3.4" } },
	request: { options: DEFAULT_AUTH, route: DEFAULT_ROUTE },
	response: {
		name: "@mockscope/foobar",
		versions: { "2.3.4": { name: "@mockscope/foobar" } },
	},
});
