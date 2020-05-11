var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');
var multer = require('multer');


var QuestionsSchema = new Schema(
    {
        question: {type: String, required: true},
        answer1: {type: String, required: true},
        answer2: {type: String, required: true},
        answer3: {type: String, required: true},
        correct: {type: String, required: true},
        part: {type: Number, required: true},
        
    }
);

//virtual url
QuestionsSchema.virtual('url').get(
    function(){
        return '/Questions/'+this._id;
    }
);



module.exports = mongoose.model('Questions', QuestionsSchema);
