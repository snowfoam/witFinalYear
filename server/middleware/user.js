var jwt = require('jsonwebtoken')
var { secretkey } = require('../shared/constant')

exports.checkUserType = function (req, res, next) {
    var userType = req.params.userType

    if (userType !== 'teacher' && userType !== undefined) {
        return res.status(400).json({ error: true, message: "Wrong request!" })
    }

    next()
}
exports.checkTeacherAuth = function (req, res, next) {
    const token = req.headers.Authorization || req.headers.authorization
    if (!token) {
        return res.status(403).json({ error: true, message: 'not authorized.' })
    }

    jwt.verify(token, secretkey, (err, data) => {
        if (err) {
            return res.status(403).json({ error: true, message: err.message })
        } else if (!data || !data.userType === 'teacher') {
            return res.status(400).json({ error: true, message: 'not a valid teacher' })
        }

        // set teacher's id
        if (req.body) {
            req.body._id = data.id
        } else {
            req.body = { _id: data.id }
        }
    })

    next()
}
