const mongoose = require('mongoose')

// create a schema
const authorSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   }
})

module.exports = mongoose.model('Author', authorSchema)

