import test from "ava";
import { DEFAULT_AUTH, DEFAULT_ROUTE, verify } from "./_util.ts";

test("port", verify, {
	options: { port: 63000 },
	requests: [{ options: DEFAULT_AUTH, route: DEFAULT_ROUTE }],
	responses: [{ name: "@mockscope/foobar" }],
});

test("hostname", verify, {
	options: { hostname: "127.0.0.1" },
	requests: [{ options: DEFAULT_AUTH, route: DEFAULT_ROUTE }],
	responses: [{ name: "@mockscope/foobar" }],
});

test("package name", verify, {
	options: { packages: [{ name: "foobar" }] },
	requests: [{ options: DEFAULT_AUTH }],
	responses: [{
		name: "foobar",
		versions: { "1.0.0": { name: "foobar" } },
	}],
});

test("package version", verify, {
	options: { packages: [{ version: "2.3.4" }] },
	requests: [{ options: DEFAULT_AUTH, route: DEFAULT_ROUTE }],
	responses: [{
		name: "@mockscope/foobar",
		versions: { "2.3.4": { name: "@mockscope/foobar" } },
	}],
});

test("multiple", verify, {
	options: { packages: [{ name: "foobar" }, { version: "2.3.4" }] },
	requests: [
		{ options: DEFAULT_AUTH, route: "/foobar" },
		{ options: DEFAULT_AUTH, route: DEFAULT_ROUTE },
	],
	responses: [
		{ name: "foobar" },
		{ name: "@mockscope/foobar", versions: { "2.3.4": { name: "@mockscope/foobar" } } },
	],
});
