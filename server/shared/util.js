var cryptoJs = require('crypto-js')

// validate password when login
exports.validatePassword = async function (email, password) {
    var user = await this.findOne({ email })
    var pwd = cryptoJs.SHA1(password).toString()
    return user && user.password === pwd
}

// Normalize a port into a number, string, or false.
exports.normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}