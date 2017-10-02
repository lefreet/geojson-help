/*
reference from:
https://github.com/ecomfe/echarts/blob/8eeb7e5abe207d0536c62ce1f4ddecc6adfdf85e/src/util/mapData/rawData/encode.js
https://github.com/mbloch/mapshaper
 */

var _ = require('lodash')

var encode = function (json) {

  var features = json.features || [];

  features.forEach(feature => {
    var encodeOffsets = feature.geometry.encodeOffsets = [];
    var coordinates = feature.geometry.coordinates;

    if(feature.geometry.type === 'Polygon') {
      coordinates
      //.filter((coordinate, i) => i === 0)// || i === coordinates.length - 1 || i % 3 === 0)
      .forEach((coordinate, i) => {
        coordinates[i] = encodePolygon(
          coordinate, encodeOffsets[i] = []
        );
      })
    } else if (feature.geometry.type === 'MultiPolygon') {
      coordinates.forEach((polygon, i) => {
        encodeOffsets[i] = [];
        polygon
        //.filter((coordinate, i) => i === 0)// || i === polygon.length - 1 || i % 3 === 0)
        .forEach((coordinate, j) => {
          coordinates[i][j] = encodePolygon(
            coordinate, encodeOffsets[i][j] = []
          )
        })
      })
    }
  })

  json.UTF8Encoding = true;

  return json;

}


var encodePolygon = function (coordinate, encodeOffsets) {

    // 抽稀
    coordinate = coordinate.filter((point, i) => i === 0 || (i === coordinate.length - 1) || i % 10 === 0)

    var result = '';

    var prevX = quantize(coordinate[0][0]);
    var prevY = quantize(coordinate[0][1]);
    // Store the origin offset
    encodeOffsets[0] = prevX;
    encodeOffsets[1] = prevY;

    for (var i = 0; i < coordinate.length; i++) {

        var point = coordinate[i];

        point = cutcode(point);

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

/**
 * encode location accuracy
 * @param  [number, number] point [description]
 * @return {[type]}          [description]
 */
var cutcode = function (point) {
  return [
    _.round(point[0], 6),
    _.round(point[1], 6)
  ]
}

var quantize = function (val) {
    return Math.ceil(val * 1024);
}

module.exports = encode;
