import type { Options } from "tsup";

export default {
	entry: ["src/index.ts"],
	dts: {
		entry: "src/index.ts",
		resolve: true,
		only: true,
	},
	format: "esm",
	clean: true,
} satisfies Options;
