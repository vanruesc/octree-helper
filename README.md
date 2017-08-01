# Octree Helper

[![Build status](https://travis-ci.org/vanruesc/octree-helper.svg?branch=master)](https://travis-ci.org/vanruesc/octree-helper) 
[![npm version](https://badge.fury.io/js/octree-helper.svg)](http://badge.fury.io/js/octree-helper) 
[![Dependencies](https://david-dm.org/vanruesc/octree-helper.svg?branch=master)](https://david-dm.org/vanruesc/octree-helper)

An octree visualisation tool for [three.js](https://threejs.org/).


## Installation

```sh
npm install octree-helper
``` 


## Usage

The following example uses the [sparse-octree](https://github.com/vanruesc/sparse-octree) module.

```javascript
import { Scene } from "three";
import { Octree } from "sparse-octree";
import OctreeHelper from "octree-helper";

const scene = new Scene();
const octree = new Octree();
const octreeHelper = new OctreeHelper(octree);

// Render the helper.
scene.add(octreeHelper);

// Rebuild the helper geometry.
octreeHelper.update();

// Destroy the geometry.
octreeHelper.dispose();
```

A full example can be found [here](https://vanruesc.github.io/sparse-octree/public/demo).


## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
