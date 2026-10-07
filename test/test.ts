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
	packageNames: ["foobar"],
	requests: [{ options: DEFAULT_AUTH }],
	responses: [{ name: "foobar" }],
});

test("passes through custom mocks", verify, {
	options: {
		packages: [{
			name: "foobar",
			repository: {
				type: "git",
				url: "https://github.com/org/repo",
			},
		}],
	},
	requests: [{ options: DEFAULT_AUTH, route: "/foobar" }],
	responses: [{
		name: "foobar",
		repository: {
			type: "git",
			url: "https://github.com/org/repo",
		},
	}],
});

test("multiple", verify, {
	packageNames: ["foobar", "@mockscope/foobar"],
	requests: [
		{ options: DEFAULT_AUTH },
		{ options: DEFAULT_AUTH, route: DEFAULT_ROUTE },
	],
	responses: [
		{ name: "foobar" },
		{ name: "@mockscope/foobar" },
	],
});
