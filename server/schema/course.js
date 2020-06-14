var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CourseSchema = new Schema({
    courseName: {
        unique: true,
        type: String
    },
    subjectId: {
        type: ObjectId,
        ref: 'Subject'
    }
})

mongoose.model('Course', CourseSchema)
