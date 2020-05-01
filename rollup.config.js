import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { eslint } from "rollup-plugin-eslint";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

// Meta settings.

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.peerDependencies);
const globals = Object.assign({}, ...external.map((value) => ({
	[value]: value.replace(/-/g, "").toUpperCase()
})));

// Plugin settings.

const settings = {

	babel: {
		babelHelpers: "bundled"
	}

}

// Bundle configurations.

const lib = {

	module: {
		input: "src/index.js",
		external,
		plugins: [resolve(), eslint()],
		output: [
			{
				file: pkg.module,
				format: "esm",
				globals,
				banner
			}, {
				file: pkg.main,
				format: "esm",
				globals
			}, {
				file: pkg.main.replace(".js", ".min.js"),
				format: "esm",
				globals
			}
		]
	},

	main: {
		input: production ? pkg.main : "src/index.js",
		external,
		plugins: production ? [babel(settings.babel)] : [resolve(), eslint()],
		output: {
			file: pkg.main,
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals,
			banner
		}
	},

	min: {
		input: pkg.main.replace(".js", ".min.js"),
		external,
		plugins: [terser(), babel(settings.babel)],
		output: {
			file: pkg.main.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals,
			banner
		}
	}

};

export default production ? [lib.module, lib.main, lib.min] : [lib.main];
