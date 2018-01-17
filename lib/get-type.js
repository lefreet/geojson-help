var isLngLat = require('./is-lnglat')

var getType = function (coordinates = []) {
  let empty = [null, null]
  if (coordinates.length === 0) {
    return ''
  } else if (isLngLat(coordinates)) {
    return 'Point'
  } else if (isLngLat(coordinates[0])) {
    // it's difficult to see difference LineStrings between MultiPoints
    // default LineStrings
    return 'LineString' || 'MultiPoint'
  } else if (isLngLat(coordinates[0][0])) {
    let points = coordinates[0]
    let firstPoint = points[0]|| empty
    let lastPoint = points[points.length - 1] || empty
    if(firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]) {
      return 'Polygon'
    } else {
      return 'MultiLineString'
    }
  } else {
    return 'MultiPolygon'
  }
}

module.exports = getType