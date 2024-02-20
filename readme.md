# private-registry-mock

Simple mocked server and package of an npm private registry. Inspired by [`mock-private-registry`](https://github.com/rexxars/mock-private-registry).

## Install

```sh
npm install --save-dev private-registry-mock
```

<details>
<summary>Other Package Managers</summary>

```sh
yarn add --dev private-registry-mock
```

</details>

## Usage

This package exports a function that starts a server and exposes an endpoint for the given package name, returning a JSON object with a mock of the [package's metadata](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md) from the npm registry.

The default route is shown below:

```ts
import mockPrivateRegistry from "private-registry-mock";
import ky from "ky";

const server = await mockPrivateRegistry();
const response = await ky.get("http://localhost:63142/@mockscope%2Ffoobar", {
  headers: { authorization: "Bearer SecretToken" }
}).json();

console.log(response);
//=> { name: "@mockscope/foobar", ... }

server.close();
```

Also exposes a health-check endpoint at `/` for testing connectivity:

```ts
import mockPrivateRegistry from "private-registry-mock";
import ky from "ky";

const server = await mockPrivateRegistry();
const response = await ky.get("http://localhost:63142/").json();

console.log(response);
//=> { message: "Connected!" }

server.close();
```

## API

### mockPrivateRegistry(packageName)

### mockPrivateRegistry(options?)

Returns a `Promise<object>` with the computed server [options](#options) and:

- `close()` *(Function)* - Closes the server.

#### packageName

Type: `string`\
Default: `"@mockscope/foobar"`

The name of the mocked package. Determines the route of the server.

Names are soft encoded, preserving `@`s but escaping all other special characters via [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) (i.e. `/` becomes `%2F`).

#### options

Type: `object`

Options for the server to use while mocking.

##### port

Type: `number`\
Default: `63142 | 63143 | 63144`, in order of availability.

The port to listen on. If not provided, attempts to use a set of default ports, and falls back to a random port if unavailable.

##### hostname

Type: `string`\
Default: `"localhost"`

The hostname to listen on.

##### token

Type: `object`\
Default: `{ type: "bearer", value: "SecretToken" }`

The authentication type and token to use.

###### type

Type: `"bearer" | "basic"`\
Default: `"bearer"`

The type of authentication to use.

###### value

Type: `string`\
Default: `"SecretToken"`

The token to use for authentication.

##### package

Type: `object`\
Default: `{ name: "@mockscope/foobar", version: "1.0.0" }`

Information about the mocked package. Determines the route of the server.

Names are soft encoded, preserving `@`s but escaping all other special characters via [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) (i.e. `/` becomes `%2F`).

###### name

Type: `string`\
Default: `"@mockscope/foobar"`

The name of the mocked package. Determines the route of the server.

###### version

Type: `string`\
Default: `"1.0.0"`

The version of the mocked package.

## Related

- [mock-private-registry](https://github.com/rexxars/mock-private-registry) - Mock of a private npm registry, useful for testing npm-related stuff.
- [@probablyup/mock-private-registry](https://github.com/quantizor/mock-private-registry) - Mock of a private npm registry, useful for testing npm-related stuff. This is a fork of "mock-private-registry" with support for mocking multiple packages.
- [package-json](https://github.com/sindresorhus/package-json) - Get metadata of a package from the npm registry.
