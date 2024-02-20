/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type * as http from "http"; // eslint-disable-line unicorn/prefer-node-protocol
import type * as polka from "polka";
import type { ServerOptions } from "../server.ts";
import type { ResponseMethod } from "./response-helpers.js";

declare module "polka" {
	interface Request {
		token?: string;
	}
}

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
