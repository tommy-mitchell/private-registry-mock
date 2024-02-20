import polka from "polka";
import { responseHelpers } from "./middlewares/response-helpers.js";
import { auth } from "./middlewares/auth.js";
import { packageMock } from "./middlewares/package.js";

/** Options for the server to use while mocking. */
export type ServerOptions = {
	/**
	 * The port to listen on. If not provided, attempts to use a set of default ports, and falls back to a random port if unavailable.
	 *
	 * @default 63142 | 63143 | 63144
	 */
	port: number;

	/**
	 * The hostname to listen on.
	 *
	 * @default "localhost"
	 */
	hostname: string;

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
		type: "bearer" | "basic";

		/**
		 * The token to use for authentication.
		 *
		 * @default "SecretToken"
		 */
		value: string;
	};

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
};

export type CloseFunction = () => void;

const softEncode = (pkg: string) => encodeURIComponent(pkg).replace(/^%40/, "@");

export const configureServer = async (options: ServerOptions): Promise<CloseFunction> => {
	const packageRoute = `/${softEncode(options.package.name)}`;

	const app = polka()
		.use(responseHelpers)
		.use((_req, res, next) => {
			res.ctx = options;
			void next();
		})
		.get("/", (_req, res) => {
			res.ok("Connected!");
		})
		.use(packageRoute, auth, packageMock)
		.listen(options.port, options.hostname);

	return () => {
		app.server.close();
	};
};
