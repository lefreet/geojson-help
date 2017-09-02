var format = function (json) {

  var _json = {
    type: 'FeatureCollection',
    features: []
  };

  var features = _json.features;

  _json.features = json.features.map(feature => {

    var attr = feature.attributes;

    // some paths, some rings， 后面了解下
    var polygons = feature.geometry.paths || feature.geometry.rings || [[]];

    var type = polygons[0][0][0][0] ? 'MultiPolygon' : 'Polygon'

    var _feature = {
      type: 'Feature',
      id: attr.idno,
      properties: {
        name: attr.NAME,
        // cp: getCenter(polygons)
      },
      geometry: {
        type: 'Polygon',
        coordinates: polygons
      }
    };

    return _feature;

  });

  return _json;

}

/**
 * if no center, computed
 * @return {[type]} [description]
 */
// var getCenter = function (points) {

//   var _points = _.flattenDeep(points)

// }

module.exports = format

