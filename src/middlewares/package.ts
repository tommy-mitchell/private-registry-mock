import type { Middleware } from "polka";

export const packageMock: Middleware = (_req, res) => {
	const { hostname, port, package: { name: packageName, version: packageVersion } } = res.ctx;
	const moduleName = packageName.split("/").at(-1)!;

	const pkg = {
		"_id": packageName,
		"_rev": "1-c30105564f195a3038d3348840c9e080",
		"name": packageName,
		"description": "Fake module",
		"dist-tags": {
			latest: packageVersion,
		},
		"versions": {
			[packageVersion]: {
				name: packageName,
				version: packageVersion,
				description: "Fake module",
				main: "index.js",
				license: "MIT",
				gitHead: "2666d6874aaebbaf7188e14d94eb8488079d6c2c",
				_id: `${packageName}@${packageVersion}`,
				_shasum: "19d13344e0b701cae3374fa6f03d2d3f90847c1c",
				_from: ".",
				_npmVersion: "10.2.3",
				_nodeVersion: "20.10.0",
				_npmUser: {
					name: "foobar",
					email: "foobar@npmjs.org",
				},
				maintainers: [{
					name: "foobar",
					email: "foobar@npmjs.org",
				}],
				dist: {
					integrity: "sha512-Q2bFTOhEALkN8hOms2FKTDLy7eugP2zFZ1T8LCvX42Fp3WoNr3bjZSAHeOsHrbV1Fu9/A0EzCinRE7Af1ofPrw==",
					shasum: "cd2e97011c99721c5f0a6d677c50a144ec790a2d",
					tarball: `http://${hostname}:${port}/${packageName}/-/${moduleName}-${packageVersion}.tgz`,
					fileCount: 1,
					unpackedSize: 0xDEADBEEF, // eslint-disable-line unicorn/numeric-separators-style
					// dprint-ignore
					signatures: [{
						keyid: "SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA",
						sig: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==",
					}],
				},
				directories: {},
			},
		},
		"readme": "Mock module!\n",
		"maintainers": [{
			name: "foobar",
			email: "foobar@npmjs.org",
		}],
		"time": {
			modified: "2024-02-20T01:38:44.202Z",
			created: "2024-02-20T01:38:44.202Z",
			[packageVersion]: "2024-02-20T01:38:44.202Z",
		},
		"license": "MIT",
		"readmeFilename": "README.md",
		"_attachments": {},
	};

	res.ok(pkg);
};
