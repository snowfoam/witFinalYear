var mongoose = require('mongoose')
var path = require('path')
var glob = require('glob')
var db = require('./config')

module.exports = function () {
    mongoose.Promise = global.Promise

    // connect mongodb
    var connection = mongoose.connection;
    return new Promise((resolve, reject) => {
        mongoose.set('useCreateIndex', true)
        mongoose.connect(`mongodb://${db.host}:${db.port}/${db.database}`, { useNewUrlParser: true, useUnifiedTopology: true });

        // 1. connected
        connection.on('open', () => {
            console.log('Mongodb connected!')

            // init schemas
            glob.sync(path.resolve(__dirname, '../schema', '**/*.js')).forEach(require)
            resolve()
        })

        // 2. error
        connection.on('error', err => {
            console.log('Connect mongodb error.' + err.message)
            reject(err.message)
        })

        // 3. disconnect
        connection.on('disconnect', () => {
            console.log('Mongodb disconnected.')
            resolve()
        })
    })
}