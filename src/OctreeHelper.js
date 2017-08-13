import {
	BufferAttribute,
	BufferGeometry,
	LineSegments,
	LineBasicMaterial,
	Object3D
} from "three";

/**
 * An octree helper.
 */

export class OctreeHelper extends Object3D {

	/**
	 * Constructs a new octree helper.
	 *
	 * @param {Octree} [octree=null] - An octree.
	 */

	constructor(octree = null) {

		super();

		/**
		 * The name of this object.
		 */

		this.name = "OctreeHelper";

		/**
		 * The octree.
		 *
		 * @type {Octree}
		 * @default null
		 */

		this.octree = octree;

		this.update();

	}

	/**
	 * Creates octant geometry.
	 *
	 * @private
	 * @param {Iterator} octants - An octant iterator.
	 * @param {Number} octantCount - The size of the given sequence.
	 */

	createLineSegments(octants, octantCount) {

		const maxOctants = (Math.pow(2, 16) / 8) - 1;
		const group = new Object3D();

		const material = new LineBasicMaterial({
			color: 0xffffff * Math.random()
		});

		let result;
		let vertexCount;
		let length;

		let indices, positions;
		let octant, min, max;
		let geometry;

		let i, j, c, d, n;
		let corner, edge;

		// Create geometry in multiple runs to limit the amount of vertices.
		for(i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

			length += (octantCount < maxOctants) ? octantCount : maxOctants;
			octantCount -= maxOctants;

			vertexCount = length * 8;
			indices = new Uint16Array(vertexCount * 3);
			positions = new Float32Array(vertexCount * 3);

			// Continue where the previous run left off.
			for(c = 0, d = 0, result = octants.next(); !result.done && i < length;) {

				octant = result.value;
				min = octant.min;
				max = octant.max;

				// Create line connections based on the current vertex count.
				for(j = 0; j < 12; ++j) {

					edge = edges[j];

					indices[d++] = c + edge[0];
					indices[d++] = c + edge[1];

				}

				// Create the vertices.
				for(j = 0; j < 8; ++j, ++c) {

					corner = corners[j];

					positions[c * 3] = (corner[0] === 0) ? min.x : max.x;
					positions[c * 3 + 1] = (corner[1] === 0) ? min.y : max.y;
					positions[c * 3 + 2] = (corner[2] === 0) ? min.z : max.z;

				}

				if(++i < length) {

					result = octants.next();

				}

			}

			geometry = new BufferGeometry();
			geometry.setIndex(new BufferAttribute(indices, 1));
			geometry.addAttribute("position", new BufferAttribute(positions, 3));

			group.add(new LineSegments(geometry, material));

		}

		this.add(group);

	}

	/**
	 * Updates the helper geometry.
	 */

	update() {

		const depth = (this.octree !== null) ? this.octree.getDepth() : -1;

		let level = 0;
		let result;

		// Remove existing geometry.
		this.dispose();

		while(level <= depth) {

			result = this.octree.findOctantsByLevel(level);

			this.createLineSegments(
				result[Symbol.iterator](),
				(typeof result.size === "number") ? result.size : result.length
			);

			++level;

		}

	}

	/**
	 * Destroys this helper.
	 */

	dispose() {

		const groups = this.children;

		let group, children;
		let i, j, il, jl;

		for(i = 0, il = groups.length; i < il; ++i) {

			group = groups[i];
			children = group.children;

			for(j = 0, jl = children.length; j < jl; ++j) {

				children[j].geometry.dispose();
				children[j].material.dispose();

			}

			while(children.length > 0) {

				group.remove(children[0]);

			}

		}

		while(groups.length > 0) {

			this.remove(groups[0]);

		}

	}

}

/**
 * A binary pattern that describes the corners of an octant:
 *
 * ```text
 *    3____7
 *  2/___6/|
 *  | 1__|_5
 *  0/___4/
 * ```
 *
 * @type {Uint8Array[]}
 */

const corners = [

	new Uint8Array([0, 0, 0]),
	new Uint8Array([0, 0, 1]),
	new Uint8Array([0, 1, 0]),
	new Uint8Array([0, 1, 1]),

	new Uint8Array([1, 0, 0]),
	new Uint8Array([1, 0, 1]),
	new Uint8Array([1, 1, 0]),
	new Uint8Array([1, 1, 1])

];

/**
 * Describes all possible octant corner connections.
 *
 * @type {Uint8Array[]}
 */

const edges = [

	// X-Axis.
	new Uint8Array([0, 4]),
	new Uint8Array([1, 5]),
	new Uint8Array([2, 6]),
	new Uint8Array([3, 7]),

	// Y-Axis.
	new Uint8Array([0, 2]),
	new Uint8Array([1, 3]),
	new Uint8Array([4, 6]),
	new Uint8Array([5, 7]),

	// Z-Axis.
	new Uint8Array([0, 1]),
	new Uint8Array([2, 3]),
	new Uint8Array([4, 5]),
	new Uint8Array([6, 7])

];
