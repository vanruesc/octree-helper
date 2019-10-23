import test from "ava";
import { Vector3 } from "math-ds";
import { Octant, Octree } from "sparse-octree";
import { OctreeHelper } from "../build/octree-helper.js";

const octree = new Octree(new Octant(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
));

octree.root.split();

test("can be instantiated", t => {

	const object = new OctreeHelper();

	t.truthy(object);

});

test("creates geometry for each tree level", t => {

	const helper = new OctreeHelper(octree);

	t.is(helper.children.length, 2, "should have a child for each level");

});

test("an be destroyed", t => {

	const helper = new OctreeHelper(octree);

	helper.dispose();

	t.is(helper.children.length, 0, "should delete all children");

});
