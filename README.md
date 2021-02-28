# Octree Helper

[![Build status](https://travis-ci.org/vanruesc/octree-helper.svg?branch=master)](https://travis-ci.org/vanruesc/octree-helper) 
[![npm version](https://badgen.net/npm/v/octree-helper?color=green)](https://www.npmjs.com/package/octree-helper)
[![Peer dependencies](https://david-dm.org/vanruesc/octree-helper/peer-status.svg)](https://david-dm.org/vanruesc/octree-helper?type=peer)

:warning: __Deprecation Notice: The octree helper is now included in [sparse-octree](https://github.com/vanruesc/sparse-octree).__ :warning:

An octree visualization tool for [three.js](https://threejs.org/).

*[Demo](https://vanruesc.github.io/sparse-octree/public/demo)&ensp;&middot;&ensp;[Documentation](https://vanruesc.github.io/octree-helper/docs)*


## Installation

This library requires the peer dependency [three](https://github.com/mrdoob/three.js/).

```sh
npm install three octree-helper
``` 


## Requirements

This helper can visualize any octree that conforms to the following protocols:

- [Tree](https://vanruesc.github.io/sparse-octree/public/docs/class/src/core/Tree.js~Tree.html)
- [Node](https://vanruesc.github.io/sparse-octree/public/docs/class/src/core/Node.js~Node.html)


## Usage

The following example uses the [sparse-octree](https://github.com/vanruesc/sparse-octree) module.

```javascript
import { Scene } from "three";
import { Octree } from "sparse-octree";
import { OctreeHelper } from "octree-helper";

const scene = new Scene();
const octree = new Octree();
const octreeHelper = new OctreeHelper(octree);

// Render the helper.
scene.add(octreeHelper);

// Set a different octree.
octreeHelper.octree = otherOctree;

// Destroy the helper geometry and rebuild.
octreeHelper.update();

// Destroy the helper geometry.
octreeHelper.dispose();
```


## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
