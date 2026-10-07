import test from "ava";
import { DEFAULT_AUTH, DEFAULT_ROUTE, verify } from "./_util.ts";

test("route /", verify, {
	requests: [{ options: DEFAULT_AUTH, route: "/" }],
	responses: [{ message: "Connected!" }],
});

test("main", verify, {
	requests: [{ options: DEFAULT_AUTH, route: DEFAULT_ROUTE }],
	responses: [{ name: "@mockscope/foobar" }],
});

test("custom name", verify, {
	packages: ["foobar"],
	requests: [{ options: DEFAULT_AUTH }],
	responses: [{ name: "foobar" }],
});

test("passes through custom mocks", verify, {
	options: { packages: [{ name: "foobar", sideEffects: true }] },
	requests: [{ options: DEFAULT_AUTH, route: "/foobar" }],
	responses: [{ name: "foobar", sideEffects: true }],
});

test("multiple", verify, {
	packages: ["foobar", { version: "2.3.4" }],
	requests: [
		{ options: DEFAULT_AUTH },
		{ options: DEFAULT_AUTH, route: DEFAULT_ROUTE },
	],
	responses: [
		{ name: "foobar" },
		{
			name: "@mockscope/foobar",
			versions: { "2.3.4": { name: "@mockscope/foobar" } },
		},
	],
});

test("returns 404 for unknown route", verify, {
	requests: [{ options: DEFAULT_AUTH, route: "/unknown" }],
	responses: [{ message: "Package \"unknown\" not found", status: 404 }],
});
