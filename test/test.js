"use strict";

const OctreeHelper = require("../build/octree-helper");
const THREE = require("three");
const OCTREE = require("sparse-octree");

const box = new THREE.Box3(
	new THREE.Vector3(-1, -1, -1),
	new THREE.Vector3(1, 1, 1)
);

module.exports = {

	"OctreeHelper": {

		"can be instantiated": function(test) {

			const helper = new OctreeHelper();

			test.ok(helper);
			test.done();

		},

		"creates geometry for each tree level": function(test) {

			const octree = new OCTREE.Octree(box.min, box.max);

			octree.root.split();

			const helper = new OctreeHelper(octree);

			test.equal(helper.children.length, 2, "should have a child for each level");
			test.done();

		},

		"can be destroyed": function(test) {

			const octree = new OCTREE.Octree(box.min, box.max);
			const helper = new OctreeHelper(octree);

			helper.dispose();

			test.ok(helper, "octree helper");
			test.done();

		}

	}

};
