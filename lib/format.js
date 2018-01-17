var getCenter = require('./get-center')
var getType = require('./get-type')

/**
 * switch the method to format data
 * @param  {[type]} json [description]
 * @param  {String} from [description]
 * @param  {String} to   [description]
 * @return {[type]}      [description]
 */
var format = function (json, from = 'arcgis', to = 'geo') {
  let geojson = {}

  if (from === 'arcgis' && to === 'geo') {
    geojson = arcgis2geo(json)
  }

  return geojson
}

/*
 * format the json from 'arcgis-json' plugin to geojson
 */
var arcgis2geo = function (json) {
  let features = json.features.map(feature => {
    let properties = getProperties(feature.attributes)
    let geometry = feature.geometry
    // sometimes paths, sometimes rings, sometimes coordinates
    // who can tell me?
    let coordinates = geometry.coordinates || geometry.path || geometry.rings

    // if no center point, get it
    if (!properties.cp) {
      properties.cp = getCenter(coordinates)
    }

    return {
      type: 'Feature',
      properties: properties,
      geometry: {
        type: getType(coordinates),
        coordinates: coordinates
      }
    }
  })

  return {
    type: 'FeatureCollection',
    features: features
  }
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

module.exports = format
