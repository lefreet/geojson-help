var fs = require('fs');
var glob = require('glob');
var commander = require('commander');

var subcmd = {
  format: require('../lib/format'),
  encode: require('../lib/encode')
}

commander
  .option('-p, --path <path>', 'use glob to match files for transform, see https://github.com/isaacs/node-glob')
  .parse(process.argv);

var transform = function (flows) {

  var path = commander.path;

  glob(path, {}, function (err, files) {
    
    files
    .filter(file => file.indexOf('_geo.json') === -1 && file.indexOf('.json') > 0)
    .forEach(file => {

      var output = file.replace('.json', '_geo.json');
      var rowStr = fs.readFileSync(file, 'utf8');
      var json = JSON.parse(rowStr);

      flows.forEach(flow => {
        if(subcmd[flow]) {
          json = subcmd[flow](json)
        }
      })

      fs.writeFileSync(output, JSON.stringify(json), 'utf8');

    })

  })

}

module.exports = transform



