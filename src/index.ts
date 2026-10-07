import getPort from "get-port";
import type { PartialDeep } from "type-fest";
import { type CloseFunction, configureServer, type Package, type ServerOptions } from "./server.ts";

/** Options for the server to use while mocking. */
export type Options = PartialDeep<ServerOptions, { recurseIntoArrays: true; }>;

/** Computed server options. */
export type Response = ServerOptions & {
	/** Gracefully closes the server. */
	close: CloseFunction;
};

type PackageInput = Partial<Package> | string;

/**
 * Starts a server and exposes an endpoint for the given package(s),
 * returning a JSON object with a mock of the {@link https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md packages' metadata} from the npm registry.
 *
 * @example
 * ```ts
 * import mockPrivateRegistry from "private-registry-mock";
 * import ky from "ky";
 *
 * const server = await mockPrivateRegistry([
 * 	"@org/name",
 * 	{ version: "2.3.4", sideEffects: true },
 * ]);
 *
 * const auth = { headers: { authorization: "Bearer SecretToken" } };
 *
 * await ky.get("http://localhost:63142/@org%2Fname", auth).json();
 * //=> { name: "@org/name", version: "1.0.0", … }
 *
 * await ky.get("http://localhost:63142/@mockscope%2Ffoobar", auth).json();
 * //=> { name: "@mockscope/foobar", version: "2.3.4", sideEffects: true, … }
 *
 * await server.close();
 * ```
 */
export default async function mockPrivateRegistry(options?: Options): Promise<Response>;
export default async function mockPrivateRegistry(packages: PackageInput[]): Promise<Response>;
export default async function mockPrivateRegistry(packagesOrOptions?: Options | PackageInput[]): Promise<Response> {
	if (Array.isArray(packagesOrOptions)) {
		packagesOrOptions = {
			packages: packagesOrOptions.map(pkg => (
				typeof pkg === "string" ? { name: pkg, version: "1.0.0" } : pkg
			)),
		};
	}

	const options: ServerOptions = {
		hostname: packagesOrOptions?.hostname ?? "localhost",
		packages: packagesOrOptions?.packages?.map(pkg => ({
			...pkg,
			name: pkg.name ?? "@mockscope/foobar",
			version: pkg.version ?? "1.0.0",
		})) ?? [{
			name: "@mockscope/foobar",
			version: "1.0.0",
		}],
		port: packagesOrOptions?.port ?? await getPort({ port: [63142, 63143, 63144] }),
		token: {
			type: packagesOrOptions?.token?.type ?? "bearer",
			value: packagesOrOptions?.token?.value ?? "SecretToken",
		},
	};

	const close = await configureServer(options);
	return { ...options, close };
}
