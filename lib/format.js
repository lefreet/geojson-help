var _ = require('lodash')

var format = function (json) {

  var _json = {
    type: 'FeatureCollection',
    features: []
  };

  var features = _json.features;

  _json.features = json.features.map(feature => {

    var properties = feature.properties;

    // sometimes paths, sometimes rings, sometimes coordinates
    var coordinates = feature.geometry.coordinates || feature.geometry.paths || feature.geometry.rings;

    var _feature = {
      type: 'Feature',
      id: feature.id,
      properties: Object.assign({
        cp: getCenter(coordinates)
      }, getProperties(properties)),
      geometry: {
        type: getGeometryAttr(coordinates),
        coordinates: coordinates
      }
    };

    return _feature;

  });

  return _json;

}

/**
 * get properties with lower key
 * @param  {Object} properties [description]
 * @return {[type]}            [description]
 */
var getProperties = function (properties = {}) {

  let props = {}

  for(let key in properties) {
    props[key.toString().toLowerCase()] = properties[key]
  }

  return props

}

/**
 * if no center, computed
 * x: [-90, 90] y: [-180, 180]
 * @return {[type]} [description]
 */
var getCenter = function (coordinates) {

  let deep = getGeometryAttr(coordinates, 'deep')

  let points = _.flattenDepth(coordinates, deep)

  let lngs = points.map(point => point[0])
  let lats = points.map(point => point[1])

  let minX = _.min(lngs)
  let minY = _.min(lats)
  let maxX = _.max(lngs)
  let maxY = _.max(lats)

  let x = minX + ((maxX - minX) / 2)
  let y = minY + ((maxY - minY) / 2)

  return [x, y]

}

/**
 * get geometry type or array deep
 * reference https://tools.ietf.org/html/rfc7946#appendix-A
 * defficult to diff from LineStrings and MultiPoints 
 * coordinates must be standard geojson
 * ignore 'GeometryCollections'
 * @return {[type]} [description]
 */
var getGeometryAttr = function (coordinates, attr) {

  let coords = coordinates

  let isPoint = function (point = []) {
    return typeof point[0] === 'number' && typeof point[1] === 'number'
  }

  let samePoint = function (point1 = [], point2 = []) {
    return point1[0] === point2[0] && point1[1] === point2[1]
  }

  let value = function (type, deep) {
    return attr === 'deep' ? deep : type
  }

  if(coords.length === 0 || !coords) {
    return value('', -1)
  }

  if(isPoint(coords)) {
    return value('Point', -1)
  }

  if(isPoint(coords[0])) {
    return value('LineStrings' || 'MultiPoints', 0)
  }

  coords = coords[0]
  if(isPoint(coords[0])) {
    if(samePoint(coords[0], coords[coords.length - 1])) {
      return value('Polygon', 1)
    } else {
      return value('MultiLineStrings', 1)
    }
  }

  coords = coords[0]
  if(isPoint(coords[0])) {
    return value('MultiPolygon', 2)
  }

}

module.exports = format

