var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CourseSchema = new Schema({
    teacherId: String,
    teacherName: String,
    subjectName: String,
    description: String,
    status: String, //'open' | 'closed'
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
