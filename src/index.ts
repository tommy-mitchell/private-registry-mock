import getPort from "get-port";
import type { PartialDeep } from "type-fest";
import { type CloseFunction, configureServer, type ServerOptions } from "./server.ts";

/** Options for the server to use while mocking. */
export type Options = PartialDeep<ServerOptions>;

/** Computed server options. */
export type Response = ServerOptions & {
	/** Gracefully closes the server. */
	close: CloseFunction;
};

/** Starts a server and exposes an endpoint for the given package name, returning a JSON object with a mock of the {@link https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md package's metadata} from the npm registry. */
export default async function mockPrivateRegistry(options?: Options): Promise<Response>;
export default async function mockPrivateRegistry(packageName: string): Promise<Response>;
export default async function mockPrivateRegistry(packageOrOptions?: Options | string): Promise<Response> {
	if (typeof packageOrOptions === "string") {
		packageOrOptions = {
			package: { name: packageOrOptions, version: "1.0.0" },
		};
	}

	const options: ServerOptions = {
		hostname: packageOrOptions?.hostname ?? "localhost",
		package: {
			name: packageOrOptions?.package?.name ?? "@mockscope/foobar",
			version: packageOrOptions?.package?.version ?? "1.0.0",
		},
		port: packageOrOptions?.port ?? await getPort({ port: [63142, 63143, 63144] }),
		token: {
			type: packageOrOptions?.token?.type ?? "bearer",
			value: packageOrOptions?.token?.value ?? "SecretToken",
		},
	};

	const close = await configureServer(options);
	return { ...options, close };
}
