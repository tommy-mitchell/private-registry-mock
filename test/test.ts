import test from "ava";
import { DEFAULT_AUTH, DEFAULT_ROUTE, verify } from "./_util.ts";

test("main", verify, {
	request: { options: DEFAULT_AUTH, route: DEFAULT_ROUTE },
	response: { name: "@mockscope/foobar" },
});

test("custom name", verify, {
	packageName: "foobar",
	request: { options: DEFAULT_AUTH },
	response: { name: "foobar" },
});

test("route /", verify, {
	request: { options: DEFAULT_AUTH, route: "" },
	response: { message: "Connected!" },
});
