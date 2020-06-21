var jwt = require('jsonwebtoken')
var { secretkey } = require('../shared/constant')

function authUser(req, res, next, userType) {
    const token = req.headers.Authorization || req.headers.authorization
    if (!token) {
        return res.status(403).json({ error: true, message: 'not authorized.' })
    }

    jwt.verify(token, secretkey, (err, data) => {
        if (err) {
            return res.status(403).json({ error: true, message: err.message })
        } else if (!data || !data.userType === userType) {
            return res.status(400).json({ error: true, message: `not a valid ${userType}` })
        }

        // set user's id
        if (req.body) {
            req.body._id = data.id
        } else {
            req.body = { _id: data.id }
        }
    })

    next()
}

exports.authStudent = function (req, res, next) {
    authUser(req, res, next, 'student')
}

exports.authTeacher = function (req, res, next) {
    authUser(req, res, next, 'teacher')
}
