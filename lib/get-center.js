var _ = require('lodash')
var isLngLat = require('./is-lnglat')

/**
 * flat coordinates to points
 * @param  {Array}  coordinates [description]
 * @return {[type]}             [description]
 */
var flatCoordinates = function (coordinates = []) {
  let points = []

  if (coordinates.length === 0) {
    // empty
    console.log('this is a empty coordinates')
  } else if (isLngLat(coordinates)) {
    // Point
    points.push(coordinates)
  } else if (isLngLat(coordinates[0])) {
    // LineStrings or MultiPoints
    points = points.concat(coordinates)
  } else if (isLngLat(coordinates[0][0])) {
    // MultiLineStrings or Polygon
    coordinates.forEach(line => {
      points = points.concat(line)
    })
  } else {
    // MultiPolygon
    coordinates.forEach(polygon => {
      polygon.forEach(line => {
        points = points.concat(line)
      })
    })
  }

  return points
}

/**
 * if no center, computed
 * x: [-90, 90] y: [-180, 180]
 * @return {[type]} [description]
 */
var getCenter = function (coordinates) {
  let points = flatCoordinates(coordinates)

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

module.exports =  getCenter