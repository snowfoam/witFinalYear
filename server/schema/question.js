var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var QuestionSchema = new Schema({
    type: String, // single | multiple | trueOrFalse
    article: String,
    options: [{
        type: String | Number | Boolean,
    }],
    answer: [{
        type: String | Number | Boolean,
    }],
    subjectId: {
        type: ObjectId,
        ref: 'Subject'
    }
})

mongoose.model('Question', QuestionSchema)
