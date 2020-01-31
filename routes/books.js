const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path') // standaard in Node
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// multer package om multipart (met de plaatjes hier) forms te kunnen verwerken 
const fs = require('fs')
const upload = multer({
   dest: uploadPath,
   fileFilter: (req, file, callback) => {
      // eerste is null omdat dat in callback the error is
      callback(null, imageMimeTypes.includes(file.mimetype))
   }
})

// All the books
router.get('/', async (req, res ) => {
  //res.send('all books van mij')
  let query = Book.find()
  if (req.query.title != null && req.query.title != ''){
     query = query.regex('title', new RegExp(req.query.title, "i"))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
    query = query.lte('publishedBefore', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
   query = query.gte('publishedAfter', req.query.publishedAfter)
 }
  try{
      //const books = await Book.find({})
      const books = await query.exec()
      res.render('books/index', {
      books: books,
      searchOptions: req.query
      })
  }catch{
   res.redirect('/')
  }
})

// New book;  maar deze maakt de nieuwe book niet 
router.get('/new', async (req, res ) => {
   //console.log("/new get route")
   //res.send('new books van Rene')
   renderNewPage(res, new Book())
})

// Creating New book
 router.post('/', upload.single('cover'), async (req, res ) => {
   const fileName = req.file != null ? req.file.filename : null 
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      coverImageName: fileName,
      description: req.body.description
   })
   try{
      const newBook = await book.save()
      // res.redirect(`books/${newBook.id}`)
      res.redirect('books')
   }catch{
      // omdat multer een onterecht bookcover heeft aangemaakt in het filesysteem
      if(book.coverImageName != null){
        removeBookcover(book.coverImageName)
      }   
      renderNewPage(res, book, true) 
   }
  
})

function removeBookcover(fileName){
  fs.unlink(path.join(uploadPath, fileName), err =>{
     if (err) console.error(err)
  })
}
async function renderNewPage(res, book, hasError = false){
   try {
      const authors = await Author.find({})
      console.log("probeert authotrs te vinden")
      const params = {     
         authors: authors,
         book: book
      }
      if (hasError) params.errorMessage = 'Error creating you book'
      res.render('books/new', params)
     } catch{
      res.redirect('/books')
     }
}

module.exports = router