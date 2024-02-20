import test from "ava"; // eslint-disable-line ava/no-ignored-test-files
import ky, { type Options as KyOptions } from "ky";
import type { FullMetadata } from "package-json";
import type { PartialDeep, RequireOneOrNone as OneOrNoneOf } from "type-fest";
import privateRegistryMock, { type Options } from "../src/index.js";

export const route = "@mockscope%2Ffoobar";

export const auth = { headers: { authorization: "Bearer SecretToken" } };

// dprint-ignore
type MacroArgs = [{
	request?: {
		route?: string;
		port?: number;
		options?: KyOptions;
	};
} & OneOrNoneOf<{
	packageName: string;
	options: Options;
}> & OneOrNoneOf<{
	response: PartialDeep<FullMetadata> | { message?: string };
	error: Partial<Response> & { message?: string };
}>];

export const verify = test.macro<MacroArgs>(async (t, {
	packageName,
	options,
	request = {},
	response: expectations,
	error,
}) => {
	const hostname = options?.hostname ?? "localhost";
	const route = request.route ?? packageName ?? options?.package?.name ?? "";

	const server = await privateRegistryMock(packageName ?? options as string);
	const response = await ky.get(
		`http://${hostname}:${request.port ?? server.port}/${route}`,
		{ throwHttpErrors: false, ...request.options },
	);

	const assertions = await t.try(async tt => {
		const shouldFail = error !== undefined;

		if (shouldFail) {
			tt.log({ error });

			const message = await response.json<{ message: string; }>();
			const { message: expectedMessage, ...expectations } = error;

			tt.like(response, expectations);

			if (expectedMessage) {
				tt.is(message.message, expectedMessage);
			}
		} else {
			const data = await response.json();

			tt.log(data);
			tt.like(data, expectations ?? { message: "Connected!" });
		}
	});

	assertions.commit({ retainLogs: !assertions.passed });
	server.close();
});
