import type { Server } from "node:http";
import createHttpTerminator from "lil-http-terminator";
import polka from "polka";
import { mockPackage } from "./helpers/package.ts";
import { auth } from "./middlewares/auth.ts";
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

export type Package = {
	[index: string]: unknown;

	/**
	 * The name of the mocked package. Determines the route of the server this package is on.
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

/** Options for the server to use while mocking. */
export type ServerOptions = {
	/**
	 * The hostname to listen on.
	 *
	 * @default "localhost"
	 */
	hostname: string;

	/**
	 * Information about the mocked packages. Determines the routes of the server the packages are on.
	 *
	 * @default [{ name: "@mockscope/foobar", version: "1.0.0" }]
	 */
	packages: Package[];

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

export const configureServer = async (options: ServerOptions): Promise<CloseFunction> => {
	const app = polka()
		.use(responseHelpers)
		.use((_request, response, next) => {
			response.ctx = options;
			void next();
		})
		.get("/", (_request, response) => {
			response.ok("Connected!");
		})
		.use(auth)
		.get("/:package", (request, response) => {
			const { package: packageName } = request.params;
			const pkg = options.packages.find(({ name }) => name === packageName);

			if (!pkg) {
				response.notFound(`Package "${packageName}" not found`);
				return;
			}

			response.ok(mockPackage({ ...pkg, ...options }));
		})
		.listen(options.port, options.hostname);

	return createHttpTerminator({ server: app.server as Server }).terminate;
};
