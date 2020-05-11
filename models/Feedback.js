var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema(
    {
        username: {type: String, required: true, max: 100},
        message: {type: String, required: true, max: 500},
        contact: {type: String, required: true, max: 100},
    }
);

//virtual url
FeedbackSchema.virtual('url').get(
    function(){
        return '/Feedback/'+this._id;
    }
);

module.exports = mongoose.model('Feedbacks', FeedbackSchema);
