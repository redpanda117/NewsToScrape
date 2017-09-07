// require Mongoose
var mongoose = require('mongoose');

// Create Schema class
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  // Just a string 
 //min length prevent empty entries
  note: {
    type: String,
    require: true,
    minlength: 1
  }
});

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the model
module.exports = Note;