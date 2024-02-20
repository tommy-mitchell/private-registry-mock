/* eslint-disable @typescript-eslint/naming-convention */
import test from "ava";
import { auth, route, verify } from "./_util.js";

test("port", verify, {
	options: { port: 63000 },
	request: { route, options: auth },
	response: { name: "@mockscope/foobar" },
});

test("hostname", verify, {
	options: { hostname: "127.0.0.1" },
	request: { route, options: auth },
	response: { name: "@mockscope/foobar" },
});

test("package name", verify, {
	options: { package: { name: "foobar" } },
	request: { options: auth },
	response: {
		name: "foobar",
		versions: { "1.0.0": { name: "foobar" } },
	},
});

test("package version", verify, {
	options: { package: { version: "2.3.4" } },
	request: { route, options: auth },
	response: {
		name: "@mockscope/foobar",
		versions: { "2.3.4": { name: "@mockscope/foobar" } },
	},
});
