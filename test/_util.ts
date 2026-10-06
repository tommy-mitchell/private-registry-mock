import test, { type Macro } from "ava"; // eslint-disable-line ava/no-ignored-test-files
import ky, { type Options as KyOptions } from "ky";
import type { FullMetadata } from "package-json";
import type { PartialDeep, RequireOneOrNone as OneOrNoneOf } from "type-fest";
import privateRegistryMock, { type Options } from "#src/index.ts";

export const DEFAULT_ROUTE = "@mockscope%2Ffoobar";

export const DEFAULT_AUTH = { headers: { authorization: "Bearer SecretToken" } };

// dprint-ignore
type MacroArgs = [OneOrNoneOf<{
	error: Partial<Response> & { message?: string };
	response: PartialDeep<FullMetadata> | { message?: string };
}> & OneOrNoneOf<{
	options: Options;
	packageName: string;
}> & {
	request?: {
		options?: KyOptions;
		port?: number;
		route?: string;
	};
}];

export const verify: Macro<MacroArgs> = test.macro(async (t, {
	error,
	options,
	packageName,
	request = {},
	response: expectations,
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
			const { message: expectedMessage, ...errorExpectations } = error;

			tt.like(response, errorExpectations);

			if (expectedMessage) {
				tt.is(message.message, expectedMessage); // eslint-disable-line ava/no-conditional-assertion
			}
		} else {
			const data = await response.json();

			tt.log(data);
			tt.like(data, expectations ?? { message: "Connected!" });
		}
	});

	assertions.commit({ retainLogs: !assertions.passed });

	const { success } = await server.close();
	t.true(success, "Server did not close successfully!");
});
