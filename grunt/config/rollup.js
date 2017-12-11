const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");

module.exports = function(grunt) {

	return {

		options: {
			plugins() {

				return [
					resolve()
				].concat(
					grunt.option("production") ? [babel()] : []
				);

			}
		},

		lib: {
			options: {
				globals: {
					"three": "THREE"
				},
				external: [
					"three"
				],
				format: "umd",
				moduleName: "<%= package.name.replace(/-/g, \"\").toUpperCase() %>",
				banner: "<%= banner %>"
			},
			src: "<%= package.module %>",
			dest: "build/<%= package.name %>.js"
		}

	};

};
