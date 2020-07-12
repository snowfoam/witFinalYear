var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ExamSchema = new Schema({
    studentId: String,
    courseId: String,
    createTime: Date,
    beginTime: Date,
    endTime: Date,
    status: String, // nostart | processing | ended | cancled
    score: Number,
    duration: {
        type: Number,
        default: 60 // minutes
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]
})

mongoose.model('Exam', ExamSchema)
