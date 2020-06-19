var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SubjectSchema = new Schema({
    subjectName: {
        unique: true,
        type: String
    },
    subjectCode: String,
})

mongoose.model('Subject', SubjectSchema)
