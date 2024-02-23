import * as tsd from "tsd";
import mockPrivateRegistry, { type Options, type Response } from "../src/index.js";

tsd.expectType<Response>(await mockPrivateRegistry());
tsd.expectType<Response>(await mockPrivateRegistry("foobar"));
tsd.expectType<Response>(await mockPrivateRegistry({}));
tsd.expectType<Response>(await mockPrivateRegistry({ package: { name: "foobar" } }));

tsd.expectAssignable<Options>({});
tsd.expectAssignable<Options>({ port: 8080 });
tsd.expectAssignable<Options>({ package: { version: "0.1.0" } });
tsd.expectAssignable<Options>({ token: { value: "my_token" } });

const server = await mockPrivateRegistry();

tsd.expectType<number>(server.port);
tsd.expectType<string>(server.hostname);
tsd.expectType<string>(server.token.value);
tsd.expectType<string>(server.package.name);
tsd.expectType<string>(server.package.version);

const response = await server.close();

tsd.expectType<string>(response.code);
tsd.expectType<boolean>(response.success);
tsd.expectType<string>(response.message);
tsd.expectType<Error | undefined>(response.error);
