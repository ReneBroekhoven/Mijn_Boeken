const mongoose = require('mongoose')
const Book = require('./book')

// create a schema
const authorSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   }
})

// om voorwaarden te stellen voordat iets gebeurt
// hier voordat een remove wordt gedaan, vowr eerst deze functie uit
authorSchema.pre('remove', function(next){
  Book.find({author: this.id}, (err, books) =>{
     if (err){
        next(error)
     }else if (books.length > 0) {
         next(new Error('Deze auteur heeft nog boeken in de dd'))
     }else{
        next()
     }
  })
} )

module.exports = mongoose.model('Author', authorSchema)

