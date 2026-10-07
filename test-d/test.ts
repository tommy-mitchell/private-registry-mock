import * as tsd from "tsd";
import mockPrivateRegistry, { type Options, type Response } from "../src/index.ts";

tsd.expectType<Response>(await mockPrivateRegistry());
tsd.expectType<Response>(await mockPrivateRegistry(["foobar"]));
tsd.expectType<Response>(await mockPrivateRegistry([{ name: "foobar" }]));
tsd.expectType<Response>(await mockPrivateRegistry({}));
tsd.expectType<Response>(await mockPrivateRegistry({ packages: [{ repository: "org/repo" }] }));

tsd.expectAssignable<Options>({});
tsd.expectAssignable<Options>({ port: 8080 });
tsd.expectAssignable<Options>({ packages: [{ version: "0.1.0" }] });
tsd.expectAssignable<Options>({ token: { value: "my_token" } });

const server = await mockPrivateRegistry();

tsd.expectAssignable<number>(server.port);
tsd.expectAssignable<string>(server.hostname);
tsd.expectAssignable<string>(server.token.value);
tsd.expectAssignable<string>(server.packages[0]!.name);
tsd.expectAssignable<string>(server.packages[0]!.version);

const response = await server.close();

tsd.expectAssignable<string>(response.code);
tsd.expectAssignable<boolean>(response.success);
tsd.expectAssignable<string>(response.message);
tsd.expectAssignable<Error | undefined>(response.error);
