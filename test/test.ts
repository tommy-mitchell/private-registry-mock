import test from "ava";
import { auth, route, verify } from "./_util.js";

test("main", verify, {
	request: { route, options: auth },
	response: { name: "@mockscope/foobar" },
});

test("custom name", verify, {
	packageName: "foobar",
	request: { options: auth },
	response: { name: "foobar" },
});

test("route /", verify, {
	request: { route: "", options: auth },
	response: { message: "Connected!" },
});
