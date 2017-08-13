"use strict";

const OctreeHelper = require("../build/octree-helper");
const THREE = require("three");
const OCTREE = require("sparse-octree");

const octree = new OCTREE.Octree(
	new THREE.Vector3(-1, -1, -1),
	new THREE.Vector3(1, 1, 1)
);

octree.root.split();

module.exports = {

	"OctreeHelper": {

		"can be instantiated": function(test) {

			const helper = new OctreeHelper();

			test.ok(helper);
			test.done();

		},

		"creates geometry for each tree level": function(test) {

			const helper = new OctreeHelper(octree);

			test.equal(helper.children.length, 2, "should have a child for each level");
			test.done();

		},

		"can be destroyed": function(test) {

			const helper = new OctreeHelper(octree);

			helper.dispose();

			test.equal(helper.children.length, 0, "should delete all children");
			test.done();

		}

	}

};
