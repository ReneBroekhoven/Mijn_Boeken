const mongoose = require('mongoose')
const path = require('path')

// create a schema
const bookSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   description: {
      type: String,
   },
   publishDate: {
      type: Date,
      required: true
   },
   pageCount: {
      type: Number,
      required: true
   },
   createdAt: {
      type: Date,
      required: true,
      default: Date.now
   },
   coverImage: {
      type: Buffer,
      required: true
   },
   coverImageType:{
      type: String,
      required: true
   },
   author:{
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: 'Author'
   }
})

//Virtual field om bj Books het plaatje te kunnen laten zien
// function hier om de this te kunnen gebruiken !!
// wordt genbruikt in de books ejs index
// bookSchema.virtual('coverImagePath').get(function(){
//   if(this.coverImageName != null){
//      console.log(path.join('/', coverImageBasePath, this.coverImageName))
//    return path.join('/', coverImageBasePath, this.coverImageName)
//   }
// })
bookSchema.virtual('coverImagePath').get(function() {
   if (this.coverImage != null && this.coverImageType != null) {
     return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
   }
 })

module.exports = mongoose.model('Book', bookSchema)
