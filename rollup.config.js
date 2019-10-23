import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import resolve from "rollup-plugin-node-resolve";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const globals = { three: "THREE" };

const lib = {

	module: {
		input: "src/index.js",
		external: Object.keys(globals),
		plugins: [resolve()],
		output: [{
			file: pkg.module,
			format: "esm",
			globals: globals,
			banner: banner
		}, {
			file: pkg.main,
			format: "esm",
			globals: globals
		}].concat(production ? [{
			file: pkg.main.replace(".js", ".min.js"),
			format: "esm",
			globals: globals
		}] : [])
	},

	main: {
		input: pkg.main,
		external: Object.keys(globals),
		plugins: production ? [babel()] : [],
		output: {
			file: pkg.main,
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals: globals,
			banner: banner
		}
	},

	min: {
		input: pkg.main.replace(".js", ".min.js"),
		external: Object.keys(globals),
		plugins: [minify({
			bannerNewLine: true,
			comments: false
		}), babel()],
		output: {
			file: pkg.main.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals: globals,
			banner: banner
		}
	}

};

export default [lib.module, lib.main].concat(production ? [lib.min] : []);
