/*
reference from:
https://github.com/ecomfe/echarts/blob/8eeb7e5abe207d0536c62ce1f4ddecc6adfdf85e/src/util/mapData/rawData/encode.js
https://github.com/mbloch/mapshaper
https://docs.google.com/presentation/d/1XgKaFEgPIzF2psVgY62-KnylV81gsjCWu999h4QtaOE/edit#slide=id.i0
 */

var _ = require('lodash')

var encode = function (json) {
  var features

  var features = json.features.map(feature => {
    var type = feature.geometry.type
    var properties = feature.properties || {
      name: ''
    }
    var coordinates = []
    var encodeOffsets = []

    var data = feature.geometry.coordinates

    if(type === 'LineString') {
      coordinates = encodeOffsets(data, encodeOffsets)
    } else if (type === 'Polygon') {
      data.forEach((coordinate, i) => {
        coordinates[i] = encodePolygon(coordinate, encodeOffsets[i] = [])
      })
    } else if (type === 'MultiPolygon') {
      data.forEach((ploygon, i) => {
        encodeOffsets[i] = []
        coordinates[i] = []
        ploygon.forEach((coordinate, j) => {
          coordinates[i][j] = encodePolygon(coordinate, encodeOffsets[i][j] = [])
        })
      })
    } else {
      console.log('only support LineString, Polygon, MultiPolygon encode')
      return feature
    }

    return {
      type: feature.type,
      properties: properties,
      geometry: {
        type: type,
        coordinates: coordinates,
        encodeOffsets: encodeOffsets
      }
    }
  })

  return {
    type: json.type,
    features: features,
    UTF8Encoding: true
  }
}

/**
 * [encodePolygon description]
 * @param  {[type]} coordinate    [description]
 * @param  {[type]} encodeOffsets [description]
 * @param  {[type]} commander     [description]
 * @return {[type]}               [description]
 */
var encodePolygon = function (coordinate, encodeOffsets) {

    var result = '';

    var prevX = quantize(coordinate[0][0]);
    var prevY = quantize(coordinate[0][1]);
    // Store the origin offset
    encodeOffsets[0] = prevX;
    encodeOffsets[1] = prevY;

    for (var i = 0; i < coordinate.length; i++) {

        var point = coordinate[i];

        // point = cutcode(point);

        result += zipcode(point[0], prevX);
        result += zipcode(point[1], prevY);

        prevX = quantize(point[0]);
        prevY = quantize(point[1]);
    }

    return result;
}

var zipcode = function (val, prev){
    // Quantization
    val = quantize(val);
    // var tmp = val;
    // Delta
    val = val - prev;

    if (((val << 1) ^ (val >> 15)) + 64 === 8232) { 
        //WTF, 8232 will get syntax error in js code
        val--;
    }
    // ZigZag
    val = (val << 1) ^ (val >> 15);
    // add offset and get unicode
    return String.fromCharCode(val+64);
    // var tmp = {'tmp' : str};
    // try{
    //     eval("(" + JSON.stringify(tmp) + ")");
    // }catch(e) {
    //     console.log(val + 64);
    // }
}

var quantize = function (val) {
    return Math.ceil(val * 1024);
}

/**
 * no use
 * @param  {[type]} points [description]
 * @param  {[type]} ratio  [description]
 * @return {[type]}        [description]
 */
var dilutionPolygon = function (points, ratio = 1) {

  // console.log(parseInt(ratio, 10))
  // console.log(ratio > 0)
  // console.log(ratio <= 20)
  // console.log(ratio, Math.floor(ratio))

  ratio = parseInt(ratio, 10)

  if( ratio &&
      ratio > 0 && 
      ratio <= 20 && 
      ratio === Math.floor(ratio)
    ) {

    let len = points.length

    return points.filter((point, i) => i === 0 || (i === len - 1) || i % ratio === 0)

  } else {

    console.log('dilution value is out of range, suggestion is (0, 20] and interger, input is:' + ratio)
    return points

  }

}

module.exports = encode;
