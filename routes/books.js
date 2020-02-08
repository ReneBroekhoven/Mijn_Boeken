const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

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

// New book route;  maar deze maakt de nieuwe book niet 
router.get('/new', async (req, res ) => {
   //console.log("/new get route")
   //res.send('new books van Rene')
   renderNewPage(res, new Book())
})

// Creating New book route
 router.post('/', async (req, res ) => {
   const fileName = req.file != null ? req.file.filename : null 
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description
   })
   saveCover(book, req.body.cover)
   try{
      const newBook = await book.save()
      res.redirect(`books/${newBook.id}`)
      //res.redirect('books')
   }catch{  
      renderNewPage(res, book, true) 
   }  
})


// show book route
router.get('/:id', async (req, res) =>{
   try{
      // populate haalt alle gegevens op van de author (ipv alleen het id)
      const book = await Book.findById(req.params.id)
                              .populate('author')
                              .exec()
      res.render('books/show', {book: book})
   }catch{  
      res.redirect('/') 
   }
})

// Edit book route
router.get('/:id/edit', async (req, res ) => {
   try{
      const book = await Book.findById(req.params.id)
      //console.log(book)
      renderEditPage(res, book)
   }catch{
      res.redirect('/')
   }
})

// Update Book route
router.put('/:id', async (req, res ) => {
   let book
   try{
      book = await Book.findById(req.params.id)
      book.title = req.body.title
      book.author = req.body.author
      book.publishDate = new Date(req.body.publishDate)
      book.pageCount = req.body.pageCount
      book.description = req.body.description
      if (req.body.cover != null && req.body.cover !== '' ) {
         saveCover(book,req.body.cover)   
      }
      await book.save()
      //console.log('test')
      //res.redirect(`books/${book.id}`)
      res.redirect(`${book.id}`)
   }catch(error){  
      console.log(error)
      if (book != null) {
         renderEditPage(res, book, true) 
      }else{
         res.redirect('/')
      }
      
   }
})

// delete book page
router.delete('/:id', async (req, res) =>{
   let book
   try{
      book = await Book.findById(req.params.id)
      await book.remove()
      res.redirect(`books/`)
   }catch(error){  
      if (book != null) {
         res.render('books.show', {
            book: book,
            errorMessage: "could nog remove book"
         }) 
      }else{
         res.redirect('/')
      }
   }
})

function saveCover(book, coverEncoded) {
   if (coverEncoded == null) return
   const cover = JSON.parse(coverEncoded)
   if (cover != null && imageMimeTypes.includes(cover.type)) {
     book.coverImage = new Buffer.from(cover.data, 'base64')
     book.coverImageType = cover.type
   }
 }
async function renderNewPage(res, book, hasError = false){
   renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
   renderFormPage(res, book, 'edit', hasError)
}

// deze komt ipv de bovenste twee hier 
async function renderFormPage(res, book, form, hasError = false){
   try {
      const authors = await Author.find({})
      const params = {     
         authors: authors,
         book: book
      }
      if (hasError) {
         if (form == 'edit') {
            params.errorMessage = 'Error updating your book'
         } else {
            params.errorMessage = 'Error creating your book'
         }
      }
      res.render(`books/${form}`, params)
     } catch{
      res.redirect('/books')
     }
}



module.exports = router