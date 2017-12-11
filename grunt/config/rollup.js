const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");

module.exports = function(grunt) {

	return {

		options: {
			plugins() {

				return [
					resolve({
						jsnext: true
					})
				].concat(!grunt.option("production") ? [] :
					[babel({
						exclude: "node_modules/**"
					})]
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
