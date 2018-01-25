var decode = function (json) {
  var features = json.features.map(feature => {
    var type = feature.geometry.type
    var coordinatesString = feature.geometry.coordinates
    var encodeOffsets = feature.geometry.encodeOffsets

    var coordinates = []

    if (type === 'LineString') {
      // null
    } else if (type === 'Polygon') {
      coordinatesString.forEach((string, i) => {
        coordinates[i] = decodePolygon(string, encodeOffsets[i])
      })
    } else if (type === 'MultiPolygon') {
      coordinatesString.forEach((strings, i) => {
        strings.forEach((string, i) => {
          coordinates[i][j] = decodePolygon(string, encodeOffsets[i][j])
        })
      })
    } else {
      console.log('only support LineString, Polygon, MultiPolygon encode')
      return feature
    }

    return {
      type: feature.type,
      properties: feature.properties,
      geometry: {
        type: type,
        coordinates: coordinates
      }
    }
  })

  return {
    type: json.type,
    features: features
  }
}

var decodePolygon = function (string, encodeOffset, encodeScale = 1024) {
  var result = []
  var prevX = encodeOffset[0]
  var prevY = encodeOffset[1]

  for (var i = 0; i < string.length; i += 2) {
    var x = string.charCodeAt(i) - 64
    var y = string.charCodeAt(i + 1) - 64

    // ZigZag decoding
    x = (x >> 1) ^ (-(x & 1))
    y = (y >> 1) ^ (-(y & 1))

    // Delta decoding 
    x += prevX
    y += prevY

    prevX = x
    prevY = y

    result.push([x / encodeScale, y / encodeScale])
  }

  return result
}

module.exports =  decode;

