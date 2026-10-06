import type { Server } from "node:http";
import createHttpTerminator from "lil-http-terminator";
import polka from "polka";
import { auth } from "./middlewares/auth.ts";
import { packageMock } from "./middlewares/package.ts";
import { responseHelpers } from "./middlewares/response-helpers.ts";

export type TerminationResponse = {
	/** Termination states. */
	code: "INTERNAL_ERROR" | "SERVER_ERROR" | "TERMINATED" | "TIMED_OUT";
	/** If termination fails, the error that caused it. */
	error?: Error;
	/** Termination or error message. */
	message: string;
	/** Whether or not the server was successfully closed. */
	success: boolean;
};

/** Options for the server to use while mocking. */
export type ServerOptions = {
	/**
	 * The hostname to listen on.
	 *
	 * @default "localhost"
	 */
	hostname: string;

	/**
	 * Information about the mocked package. Determines the route of the server.
	 *
	 * @default { name: "@mockscope/foobar", version: "1.0.0" }
	 */
	package: {
		/**
		 * The name of the mocked package. Determines the route of the server.
		 *
		 * Names are soft encoded, preserving `@`s but escaping all other special characters via {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent `encodeURIComponent`} (i.e. `/` becomes `%2F`).
		 *
		 * @default "@mockscope/foobar"
		 */
		name: string;

		/**
		 * The version of the mocked package.
		 *
		 * @default "1.0.0"
		 */
		version: string;
	};

	/**
	 * The port to listen on. If not provided, attempts to use a set of default ports, and falls back to a random port if unavailable.
	 *
	 * @default 63142 | 63143 | 63144
	 */
	port: number;

	/**
	 * The authentication type and token to use.
	 *
	 * @default { type: "bearer", value: "SecretToken" }
	 */
	token: {
		/**
		 * The type of authentication to use.
		 *
		 * @default "bearer"
		 */
		type: "basic" | "bearer";

		/**
		 * The token to use for authentication.
		 *
		 * @default "SecretToken"
		 */
		value: string;
	};
};

export type CloseFunction = () => Promise<TerminationResponse>;

const softEncode = (pkg: string) => encodeURIComponent(pkg).replace(/^%40/v, "@");

export const configureServer = async (options: ServerOptions): Promise<CloseFunction> => {
	const packageRoute = `/${softEncode(options.package.name)}`;

	const app = polka()
		.use(responseHelpers)
		.use((_request, response, next) => {
			response.ctx = options;
			void next();
		})
		.get("/", (_request, response) => {
			response.ok("Connected!");
		})
		.use(packageRoute, auth, packageMock)
		.listen(options.port, options.hostname);

	return createHttpTerminator({ server: app.server as Server }).terminate;
};
