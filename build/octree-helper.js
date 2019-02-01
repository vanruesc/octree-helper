/**
 * octree-helper v0.16.0 build Fri Feb 01 2019
 * https://github.com/vanruesc/octree-helper
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('three')) :
  typeof define === 'function' && define.amd ? define(['three'], factory) :
  (global = global || self, global.OCTREEHELPER = factory(global.THREE));
}(this, function (three) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var OctreeHelper = function (_Group) {
    _inherits(OctreeHelper, _Group);

    function OctreeHelper() {
      var _this;

      var octree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, OctreeHelper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(OctreeHelper).call(this));
      _this.name = "OctreeHelper";
      _this.octree = octree;

      _this.update();

      return _this;
    }

    _createClass(OctreeHelper, [{
      key: "createLineSegments",
      value: function createLineSegments(octants, octantCount) {
        var maxOctants = Math.pow(2, 16) / 8 - 1;
        var group = new three.Group();
        var material = new three.LineBasicMaterial({
          color: 0xffffff * Math.random()
        });
        var result;
        var vertexCount;
        var length;
        var indices, positions;
        var octant, min, max;
        var geometry;
        var i, j, c, d, n;
        var corner, edge;

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
        var result;
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
        var group, children;
        var i, j, il, jl;

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
  }(three.Group);
  var corners = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];
  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  return OctreeHelper;

}));
