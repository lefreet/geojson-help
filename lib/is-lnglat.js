var isLngLat = function (point = []) {
  return typeof point[0] === 'number' && typeof point[1] === 'number'
}

module.exports = isLngLat