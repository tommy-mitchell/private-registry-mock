/* eslint-disable @typescript-eslint/naming-convention */

declare module "lil-http-terminator" {
	import type { Server } from "node:http";

	type TerminatorOptions = {
		server: Server;
		/** @default 1000 */
		gracefulTerminationTimeout?: number;
		/** @default 3000 */
		maxWaitTimeout?: number;
		/** @default console */
		logger?: typeof console;
	};

	type TerminationResponse = {
		code: "TIMED_OUT" | "SERVER_ERROR" | "TERMINATED" | "INTERNAL_ERROR";
		success: boolean;
		message: string;
		error?: Error;
	};

	export default function HttpTerminator(options: TerminatorOptions): {
		terminate: () => Promise<TerminationResponse>;
	};
}
