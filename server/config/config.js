var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    development: {
        db: 'mongodb://localhost/rserve',
        root: rootPath
    },
    test: {
        db: 'mongodb://localhost/rserve_test',
        root: rootPath
    },
    production: {}
};