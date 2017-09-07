// require Mongoose
var mongoose = require('mongoose');

// Create Schema class
var Schema = mongoose.Schema;

// Article schema
var ArticleSchema = new Schema({
    // each of these filed are require(field need to be fill out/ cannot be left blank) and is unique(prevent duplication of articles to be svae on database).
    _id: {
        Schema.Types.ObjectId     
    },
    
    title: {
        type: String,
        required: true
    },
    
    link: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type:String,
        required: true,
        unique:true
    },
    image:{
        type: String,
        require:true,
        unique:true
    },
     comment: [{ 
         type: Schema.Types.ObjectId, ref: 'Note' 
     }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// Export the model
module.exports = Article;