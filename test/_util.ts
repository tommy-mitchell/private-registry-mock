import test, { type Macro } from "ava"; // eslint-disable-line ava/no-ignored-test-files
import ky, { type Options as KyOptions } from "ky";
import type { FullMetadata } from "package-json";
import type { PartialDeep, RequireOneOrNone as OneOrNoneOf } from "type-fest";
import privateRegistryMock, { type Options } from "#src/index.ts";

export const DEFAULT_ROUTE = "/@mockscope%2Ffoobar";

export const DEFAULT_AUTH = { headers: { authorization: "Bearer SecretToken" } };

type OkResponse = PartialDeep<FullMetadata, { recurseIntoArrays: true; }> | { message?: string; };
type ErrorResponse = Partial<Response> & { message?: string; status: number; };

const shouldFail = (expected?: ErrorResponse | OkResponse): expected is ErrorResponse => (
	(expected as ErrorResponse)?.status !== undefined
);

// dprint-ignore
type MacroArgs = [ OneOrNoneOf<{
	options: Options;
	packageNames: string[];
}> & {
	requests?: Array<{
		options?: KyOptions;
		port?: number;
		route?: string;
	}>;
	responses?: Array<ErrorResponse | OkResponse>;
}];

export const verify: Macro<MacroArgs> = test.macro(async (t, {
	options,
	packageNames,
	requests = [{}],
	responses,
}) => {
	const server = await privateRegistryMock(packageNames ?? options as string[]);

	await Promise.all(requests.map(async (request, index) => {
		const route = request.route ?? `/${packageNames?.[index] ?? options?.packages?.[index]?.name ?? ""}`;
		const expected = responses?.[index];

		const hostname = options?.hostname ?? "localhost";
		const response = await ky.get(
			`http://${hostname}:${request.port ?? server.port}${route}`,
			{ throwHttpErrors: false, ...request.options },
		);

		const assertions = await t.try(async tt => {
			if (shouldFail(expected)) {
				tt.log({ expected });

				const { message } = await response.json<{ message: string; }>();
				const { message: expectedMessage, ...expectedResponse } = expected;

				tt.like(response, expectedResponse);

				if (expectedMessage) {
					tt.is(message, expectedMessage); // eslint-disable-line ava/no-conditional-assertion
				}
			} else {
				const data = await response.json();

				tt.log(data);
				tt.like(data, expected ?? { message: "Connected!" });
			}
		});

		assertions.commit({ retainLogs: !assertions.passed });
	}));

	const { success } = await server.close();
	t.true(success, "Server did not close successfully!");
});
