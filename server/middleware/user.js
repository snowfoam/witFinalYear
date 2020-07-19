var jwt = require('jsonwebtoken')
var { secretkey } = require('../shared/constant')

function auth(req, res, next, userType) {
    const token = req.cookies.token
    if (!token) {
        return res.json({ success: false, message: 'not authorized.' })
    }

    jwt.verify(token, secretkey, (err, data) => {
        if (err) {
            return res.json({ success: false, message: err.message })
        } else if (!data || (userType && data.userType !== userType)) {
            return res.json({ success: false, message: `not a valid ${userType}` })
        }

        // set user's id
        if (req.body) {
            req.body._id = data.id
            req.body.userType = data.userType
        } else {
            req.body = { _id: data.id, userType: data.userType }
        }
    })

    next()
}

exports.authUser = function (req, res, next) {
    auth(req, res, next, undefined)
}

exports.authStudent = function (req, res, next) {
    auth(req, res, next, 'student')
}

exports.authTeacher = function (req, res, next) {
    auth(req, res, next, 'teacher')
}
