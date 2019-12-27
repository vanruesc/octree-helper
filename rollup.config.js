import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.peerDependencies);
const globals = Object.assign({}, ...external.map((value) => ({
	[value]: value.replace(/-/g, "").toUpperCase()
})));

const lib = {

	module: {
		input: "src/index.js",
		external,
		plugins: [resolve()],
		output: [{
			file: pkg.module,
			format: "esm",
			globals,
			banner
		}, {
			file: pkg.main,
			format: "esm",
			globals
		}].concat(production ? [{
			file: pkg.main.replace(".js", ".min.js"),
			format: "esm",
			globals
		}] : [])
	},

	main: {
		input: production ? pkg.main : "src/index.js",
		external,
		plugins: production ? [babel()] : [],
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
		plugins: [minify({
			bannerNewLine: true,
			comments: false
		}), babel()],
		output: {
			file: pkg.main.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals,
			banner
		}
	}

};

export default (production ? [lib.module, lib.main, lib.min] : [lib.main]);
