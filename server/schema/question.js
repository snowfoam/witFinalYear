var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var QuestionSchema = new Schema({
    type: String, // single | multiple | trueOrFalse
    article: String,
    options: Schema.Types.Mixed,
    answer: Schema.Types.Mixed,
    subjectId: {
        type: ObjectId,
        ref: 'Subject'
    }
})

mongoose.model('Question', QuestionSchema)

module.exports = QuestionSchema