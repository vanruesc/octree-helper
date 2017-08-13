/**
 * octree-helper v0.2.1 build Aug 14 2017
 * https://github.com/vanruesc/octree-helper
 * Copyright 2017 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('three')) :
  typeof define === 'function' && define.amd ? define(['three'], factory) :
  (global.OCTREEHELPER = factory(global.THREE));
}(this, (function (three) { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();









  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };











  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var OctreeHelper = function (_Object3D) {
  		inherits(OctreeHelper, _Object3D);

  		function OctreeHelper() {
  				var octree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				classCallCheck(this, OctreeHelper);

  				var _this = possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this));

  				_this.name = "OctreeHelper";

  				_this.octree = octree;

  				_this.update();

  				return _this;
  		}

  		createClass(OctreeHelper, [{
  				key: "createLineSegments",
  				value: function createLineSegments(octants, octantCount) {

  						var maxOctants = Math.pow(2, 16) / 8 - 1;
  						var group = new three.Object3D();

  						var material = new three.LineBasicMaterial({
  								color: 0xffffff * Math.random()
  						});

  						var result = void 0;
  						var vertexCount = void 0;
  						var length = void 0;

  						var indices = void 0,
  						    positions = void 0;
  						var octant = void 0,
  						    min = void 0,
  						    max = void 0;
  						var geometry = void 0;

  						var i = void 0,
  						    j = void 0,
  						    c = void 0,
  						    d = void 0,
  						    n = void 0;
  						var corner = void 0,
  						    edge = void 0;

  						for (i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

  								length += octantCount < maxOctants ? octantCount : maxOctants;
  								octantCount -= maxOctants;

  								vertexCount = length * 8;
  								indices = new Uint16Array(vertexCount * 3);
  								positions = new Float32Array(vertexCount * 3);

  								for (c = 0, d = 0, result = octants.next(); !result.done && i < length;) {

  										octant = result.value;
  										min = octant.min;
  										max = octant.max;

  										for (j = 0; j < 12; ++j) {

  												edge = edges[j];

  												indices[d++] = c + edge[0];
  												indices[d++] = c + edge[1];
  										}

  										for (j = 0; j < 8; ++j, ++c) {

  												corner = corners[j];

  												positions[c * 3] = corner[0] === 0 ? min.x : max.x;
  												positions[c * 3 + 1] = corner[1] === 0 ? min.y : max.y;
  												positions[c * 3 + 2] = corner[2] === 0 ? min.z : max.z;
  										}

  										if (++i < length) {

  												result = octants.next();
  										}
  								}

  								geometry = new three.BufferGeometry();
  								geometry.setIndex(new three.BufferAttribute(indices, 1));
  								geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  								group.add(new three.LineSegments(geometry, material));
  						}

  						this.add(group);
  				}
  		}, {
  				key: "update",
  				value: function update() {

  						var depth = this.octree !== null ? this.octree.getDepth() : -1;

  						var level = 0;
  						var result = void 0;

  						this.dispose();

  						while (level <= depth) {

  								result = this.octree.findOctantsByLevel(level);

  								this.createLineSegments(result[Symbol.iterator](), typeof result.size === "number" ? result.size : result.length);

  								++level;
  						}
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						var groups = this.children;

  						var group = void 0,
  						    children = void 0;
  						var i = void 0,
  						    j = void 0,
  						    il = void 0,
  						    jl = void 0;

  						for (i = 0, il = groups.length; i < il; ++i) {

  								group = groups[i];
  								children = group.children;

  								for (j = 0, jl = children.length; j < jl; ++j) {

  										children[j].geometry.dispose();
  										children[j].material.dispose();
  								}

  								while (children.length > 0) {

  										group.remove(children[0]);
  								}
  						}

  						while (groups.length > 0) {

  								this.remove(groups[0]);
  						}
  				}
  		}]);
  		return OctreeHelper;
  }(three.Object3D);

  var corners = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  return OctreeHelper;

})));
