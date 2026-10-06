/* eslint-disable @typescript-eslint/consistent-type-definitions, perfectionist/sort-interfaces -- declaration merging */
import type * as http from "http"; // eslint-disable-line unicorn/prefer-node-protocol
import type { ServerOptions } from "../src/server.ts";
import type { ResponseMethod } from "../src/middlewares/response-helpers.ts";

type Context = ServerOptions;

declare module "http" {
	interface ServerResponse {
		ctx: Context;
		/** Sets status code to 200 and ends the response, serializing the given `data`. */
		ok: ResponseMethod;
		/** Sets status code to 403 and ends the response, serializing the given `data`. */
		forbidden: ResponseMethod;
	}
}
